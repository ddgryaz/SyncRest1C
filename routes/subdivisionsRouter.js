const Router = require('express')
const router = new Router
const subdivisionsController = require('../controllers/subdivisionsController')
const IPAllowedMiddleware = require('../middleware/IPAllowedMiddleware')
const TimeLockersMiddleware = require('../middleware/TimeLockersMiddleware')


router.post('/postSubdivisions', IPAllowedMiddleware, TimeLockersMiddleware('subdivisions'), subdivisionsController.postSubdivisionsFrom1C)

module.exports = router
