const Router = require('express')
const router = new Router()
const usersRouter = require('./usersRouter')
const subdivisionsRouter = require('./subdivisionsRouter')


router.use('/users', usersRouter)
router.use('/subdivisions', subdivisionsRouter)

module.exports = router
