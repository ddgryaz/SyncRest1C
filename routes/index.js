const Router = require('express')
const router = new Router()
const dataFrom1CRouter = require('./dataFrom1CRouter')

router.use('/data', dataFrom1CRouter)

module.exports = router
