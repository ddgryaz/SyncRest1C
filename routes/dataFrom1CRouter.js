const Router = require('express')
const router = new Router
const dataController = require('../controllers/dataController')
const IPAllowedMiddleware = require('../middleware/IPAllowedMiddleware')
const TimeLockersMiddleware = require('../middleware/TimeLockersMiddleware')
const validateReq = require('../middleware/validateReq')

router.post('/postData',
    IPAllowedMiddleware,
    // validateReq,
    TimeLockersMiddleware('dataFrom1C'),
    dataController.syncDataFrom1CWithMongo)

module.exports = router
