"use sctict"
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { serverPort } = require('../config.js');
const port = process.env.PORT || serverPort;

// const passport = require('passport');
// const { Strategy } = require('passport-jwt');

// const { jwt } = require('../config');

//midleware
// passport.use(new Strategy(jwt, function(jwt_payload, done) {
//     if(jwt_payload != void(0)) return done(false, jwt_payload);
//     done();
// }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.Promise = require('bluebird');
mongoose.set('debug', true);

app.use(morgan('tiny'));

app.use(cookieParser());
//end

//datebase connection
const { setUpConnection } = require('./utils/dataBaseUtils');
setUpConnection();



require('./router')(app);



app.listen(port, () => {
    console.log(`Server started on port:${port}`);
});