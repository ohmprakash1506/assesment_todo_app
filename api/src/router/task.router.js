const express = require('express');
const TaskController = require('../controller/task.controller');
const UserMiddleWare = require('../services/jwtToken');

const router = express.Router();
const taskController = new TaskController();
const userMiddleware = new UserMiddleWare();

router.post('/createTask', taskController.createTask)
router.put('/updateTask', taskController.updateTask)
router.get('/listAllUsers', taskController.listTask)
router.delete('/deleteTask', taskController.deleteTask)

module.exports = router