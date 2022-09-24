"use strict";

const express = require('express');
const loaders = require('./loaders');

const dotenv = require('dotenv');
dotenv.config();

let startServer = async() => {
    const app = express();
    await loaders.init(app);

    app.listen(process.env.PORT, err => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`Express running at port: ${process.env.PORT} -> ${process.env.APP_URL}:${process.env.PORT}`);
    });
};
startServer();