const morgan = require('morgan');
const path = require("path");
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoConnect = require('connect-mongo');
const cors = require('cors');

const databaseLoader = require('./database');
const api = require('../routes');
const { seedUsers } = require('../seeder/userSeeder');

let init = async (app) => {
    await databaseLoader.init();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({
        secret: 'dSDASDssdASDsd287aaSzassa91zSDas',
        saveUninitialized: true,
        resave: true,
        store: mongoConnect.create({
            mongoUrl: process.env.DATABASE_URL
        })
    }));
    app.use(express.static(path.join(__dirname, '/')))
    app.use(cookieParser());
    app.use(methodOverride('_method'));
    app.use(morgan('dev'));

    seedUsers();

    app.use(cors());
    app.use('/api', api);

    app.use(async(err, req, res, next) => {
        console.error(err);
        return res.status(500).send({error: err});
    });
};

module.exports = { init };