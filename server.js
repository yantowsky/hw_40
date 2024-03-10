require('dotenv').config()

const express = require('express');
const server = express();
const moment = require('moment');
const handlebars = require('express-handlebars');

const host = 'localhost';
const port = process.env.APP_PORT || 3000;

const arrStatSrv = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];
const arrErrSrv = [500, 501, 502, 503, 504, 506, 507, 508, 509, 510, 511, 521, 522, 523, 525, 530];

let strTime, endTime, reqTime;

server.engine(
    'handlebars',
    handlebars.engine({ defaultLayout: 'main' })
);
server.set('views', './views');
server.set('view engine', 'handlebars');

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

server.get('/', (req, res) => {
    strTime = moment().startOf().format('x');

    const second = randomInteger(1, 3);
    const percent = randomInteger(1, 10) * 10;

    console.log("random num: " + second);
    console.log(percent + "%");

    function renderHtml(status) {
        console.log(`Status code: ${status}`);

        endTime = moment().endOf().format('x');
        reqTime = (endTime - strTime) / 1000;

        console.log(`Request delay time: ${reqTime} sec`);
        console.log("===================================");

        res.render('home', {
            statusSrv: `Status code: ${status}`,
            timeReq: `Request delay time: ${reqTime} seconds.`,
            imgUrl: `https://http.cat/images/${status}.jpg`
        });
    }

    function statusServer() {
        if (percent !== 10) {
            const statSrv = arrStatSrv[randomInteger(0, arrStatSrv.length - 1)]
            res.status(statSrv);
            renderHtml(statSrv);
        } else {
            const errSrv = arrErrSrv[randomInteger(0, arrErrSrv.length - 1)]
            res.status(errSrv);
            renderHtml(errSrv);
        }
    }

    setTimeout(() => {
        statusServer();
    }, second * 1000);
});

server.listen(port, () => {
    console.log(`Server listens http://${host}:${port}`);
});