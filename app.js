// app.js
// Service Application

import bodyParser from 'body-parser';
import express from 'express';
import log4js from 'log4js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3010;
const __dirname = dirname(fileURLToPath(import.meta.url));
const logger = log4js.getLogger();
logger.level = 'info';

app.use(log4js.connectLogger(
    logger, 
    {
        level: 'auto',
        format: ':remote-addr ":method :url" :status ":user-agent"' 
    }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST");
    next();
});
app.use(express.static(join(__dirname, 'public')));

export { logger };

/** Router Begin **/

/**
 * Code Define
 * 
 * 200: OK
 * 400: Bad Request
 * 502: Bad Gateway
 */

/** Rate Router **/
import { rate_router } from './router/rate.js';
app.use('/api/rate', rate_router);

/** Router End **/

/**
 * robots.txt
 */
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
    return;
});

/**
 * service start
 */
app.listen(port, () => {
    logger.info('Service Starting...');
    logger.info(`The Service is listening on port ${port}.`);
});
