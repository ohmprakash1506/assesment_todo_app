const express = require('express');
const userRouter = require('../router/user.router')
const taskRouter = require('../router/task.router')

const router = express.Router();

const defaultRoute = [
    {
        path:'/user',
        route: userRouter
    },
    {
        path:'/task',
        route: taskRouter
    }
]

defaultRoute.forEach((route) =>{
    router.use(route.path, route.route)
})

module.exports = router;