const axios = require('axios')
const bodyParser = require('body-parser')
const express = require('express')
const log4js = require('log4js')

const app = express()
const port = 3010
const logger = log4js.getLogger()
logger.level = 'info'

app.use(log4js.connectLogger(
    logger, 
    {
        level: 'auto',
        format: ':remote-addr ":method :url" :status ":user-agent"' 
    }
))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST");
    next();
})

/**
 * robots.txt
 */
app.get('/robots.txt', (req, res) => {
    res.type('text/plain')
    res.send("User-agent: *\nDisallow: /")
    return
})

/**
 * get rate
 * request.query = year, month, day, transCur, baseCur
 * response.body = { 'code': code, 'data': '' }
 */
app.get('/api/rate', (req, res) => {
    let year = req.query.year
    let month = req.query.month
    let day = req.query.day
    let transCur = req.query.transCur
    let baseCur = req.query.baseCur
    if (!year && !month && !day) {
        let today = new Date();
        year = today.getFullYear();
        month = today.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        day = today.getDate();
        day = day < 10 ? '0' + day : day;
    }
    axios.get('https://www.unionpayintl.com/upload/jfimg/' + year + month + day + '.json')
    .then(res => {
        let exchangeRateJson = res.data.exchangeRateJson;
        exchangeRateJson.forEach(element => {
            if (element.transCur == transCur & element.baseCur == baseCur) {
                console.log(element);
                return;
            }
        });
    })
    .catch(err => {
        console.log(err);
    })
})

/**
 * service start
 */
app.listen(port, () => {
    logger.info('Service Starting...')
    logger.info(`The Service is listening on port ${port}.`)
})