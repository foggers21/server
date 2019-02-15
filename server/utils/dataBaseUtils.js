"use strict"

const mongoose = require('mongoose');
const _ = require('lodash');


const { db } = require('../../config.js');

const TodoModel = require('../models/todo.model.js');
const UsersModel = require('../models/user.model');

module.exports = {
    setUpConnection:  function() {
        mongoose.connect(db.url,{useNewUrlParser: true});
    },
    
    listTodos:  function(user){
        return  TodoModel.find({userId: user});
    },

    createTodo: async function(data, userid){
        
        return  TodoModel.create({
            title: data.title,
            completed: false,
            userId: userid
        }); 
        
    },

    deleteTodo:  function(id){
        return  TodoModel.findByIdAndDelete(id);
    },

    updateTodo: async function(id, data){

        let todo = await TodoModel.findById(id);

        let updateData = await {
            title: data.title,
            completed: data.completed
        }
        
        if(updateData.title == void(0)){
            updateData.title = todo.title;
        }

        if(updateData.completed == void(0)){
            updateData.completed = todo.completed;
        }

        return TodoModel.findByIdAndUpdate(id, updateData, (err) => {
            console.error("Error update:", err);
        });
    },

    //find user
    findUser: function(data){
        return UsersModel.findOne({username: {$regex: _.escapeRegExp(data.username), $options: "i"}}).lean().exec();
    },

    //create user
    createUser: function(data){
        
        return UsersModel.create({
            username: data.username,
            password: data.password
        });
    }


}