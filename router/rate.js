// rate.js
// Rate Router

import express from 'express';
import axios from 'axios';
import { logger } from '../app.js';

const router = express.Router();

/**
 * Code Define
 * 
 * 200: OK
 * 400: Bad Request
 * 502: Bad Gateway
 */

/** Rate Router Begin **/

/**
 * get rate
 * request.query = year, month, day, transCur, baseCur
 * response.body = { 'data': '' }
 */
router.get('', (req, res) => {
    try {
        let year = req.query.year;
        let month = req.query.month;
        let day = req.query.day;
        let transCur = req.query.transCur;
        let baseCur = req.query.baseCur;
        if (!year || !month || !day) {
            let today = new Date();
            year = today.getFullYear();
            month = today.getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            day = today.getDate();
            day = day < 10 ? '0' + day : day;
        };
        if (!transCur || !baseCur) {
            transCur = 'JPY';
            baseCur = 'CNY';
        };
        axios.get('https://www.unionpayintl.com/upload/jfimg/' + year + month + day + '.json')
        .then(data => {
            let exchangeRateJson = data.data.exchangeRateJson;
            exchangeRateJson.forEach(element => {
                if (element.transCur == transCur & element.baseCur == baseCur) {
                    res.status(200).json({
                        data: element,
                    })
                    return;
                };
            });
        })
        .catch(err => {
            logger.error('Error:', err);
            res.sendStatus(400);
            return;
        });
    } catch (error) {
        logger.error('Error:', error);
        res.sendStatus(502);
        return;
    };
});

/** Rate Router End **/

export { router as rate_router };
