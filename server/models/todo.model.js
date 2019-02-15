"use strict"

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    title: {type: String},
    completed: {type: Boolean},
    editing: {type: Boolean},
    userId:{type: String}
},{
    versionKey: false,
    collection: "MessageCollection"
});


module.exports = mongoose.model('TodoModel', TodoSchema);

