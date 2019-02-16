"use strict"
const db = require('./utils/dataBaseUtils');
const config = require('../config');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');



function createToken (body) {
    return jwt.sign(
        body,
        config.jwt.secretOrKey,
        {expiresIn: config.expiresIn}
    );
}

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
           await db.updateTodo(req.params.id,req.body).then(data => res.send(data));
        }catch(e){
            console.error("error update: ", e);
        }
    });

    //check login
    app.get('/checkLogin',(req, res) => {
        passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
            if(jwtError != void(0) || err != void(0)) {
                res.send({auth: false});
            }else 
                res.send({auth: true });

            req.user = decryptToken;
            
        })(req, res);

    });


    //login
    app.post('/login',async (req, res) => {
        try{
        let user = await db.findUser(req.body);
        if(user != void(0) && bcrypt.compareSync(req.body.password, user.password)){
            
            const token = createToken({id: user._id, username: user.username});

            res.cookie('token', token, {
                httpOnly: true
            });

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
            if(user != void(0)) return res.status(401).send({message: "User already exist"});

            user = await db.createUser(req.body);

            const token = createToken({id: user._id, username: user.username});

            res.cookie('token', token, {
                httpOnly: true
            });

            res.status(200).send({message: "User created."});

        }catch(e){
            console.error("Eroor: register:", e);
            res.status(500).send({message: "some error"});
        }
    });

    //logout
    app.post('/logout', (req, res) => {
        res.clearCookie('token');
        res.status(200).send({message: "Logout success."});
    });


}