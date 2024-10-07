const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
    task:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    completed:{
        type: Boolean,
        required: true,
        default: false
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    }
})

const Task = model('Task', taskSchema)

module.exports = Task