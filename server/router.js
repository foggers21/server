"use strict"
const db = require('./utils/dataBaseUtils');
const config = require('../config');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');


function createToken (body) {
    return jwt.sign(
        body,
        config.jwtKey.secretOrKey,
        {expiresIn: config.expiresIn}
    );
}

const { jwtKey } = require('../config');
const { Strategy } = require('passport-jwt');

passport.use(new Strategy(jwtKey, function(jwt_payload, done) {
    if(jwt_payload != void(0)) return done(false, jwt_payload);
    done();
}));

module.exports = app => {

    

    //get all todos for user
    app.get('/todos/:user',async (req, res) => {
        try{
            let data = await db.listTodos(req.params.user);
            res.send(data);
        }catch(e){
            console.error("error get: ", e);
        }
    });


    //create todo
    app.post('/todos/:user', async (req, res) => {
        try{
            let data = await db.createTodo(req.body,req.params.user)
            res.send(data);
        }catch(e){
            console.error("error create: ", e);
        }
    });



    //delete todo
    app.delete('/todos/:id',async (req ,res) => {
        try{
        let data = await db.deleteTodo(req.params.id);
        res.send(data);
        }catch(e){
            console.error("error delete: ", e);
        }     
    });


    //update todo
    app.patch('/todos/:id', async (req, res) => {
        try{
           let data = await db.updateTodo(req.params.id, req.body);
           res.send(data);
        }catch(e){
            console.error("error update: ", e);
        }
    });

    //check login
    app.post('/checkLogin',(req, res ) => {
        passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
            if(jwtError != void(0) || err != void(0)) {
                res.send({auth: false});
            }else{
                res.send({auth: true });
            };
            req.user = decryptToken;
            
        })(req, res);
        console.log(req.cookies);
    });


    //login
    app.post('/login',async (req, res) => {
        try{
        let user = await db.findUser(req.body);
        if(user != void(0) && bcrypt.compareSync(req.body.password, user.password)){
            
            const token = createToken({id: user._id, username: user.username});
            
            res.cookie('token', token, {
                httpOnly: false
            });
            console.log(req.cookies);
            res.status(200).send("You are logged");

        } else
            res.status(400).send({message: "User not exist or password not correct"});
        
        }catch(e){
            console.error("Error: login: ,", e);
            res.status(500).send({message: "some error"});
        }
    });

    //registration
    app.post('/register', async (req, res) => {
        try{
            let user = await db.findUser(req.body);
            if(user != void(0)) return res.status(401).send("User already exist");

            user = await db.createUser(req.body);

            const token = createToken({id: user._id, username: user.username});

            res.cookie('token', token, {
                httpOnly: false
            });
            console.log(req.cookies);
            res.status(200).send({message: "User created."});

        }catch(e){
            console.error("Eroor: register:", e);
            res.status(500).send({message: "some error"});
        }
    });

    //logout
    app.post('/logout', (req, res) => {
        console.log(req.cookies);
        res.clearCookie('token');
        res.status(200).send({message: "Logout success."});
    });


}