const Router = require('express')
const router = new Router
const usersController = require('../controllers/usersController')
const IPAllowedMiddleware = require('../middleware/IPAllowedMiddleware')
const TimeLockersMiddleware = require('../middleware/TimeLockersMiddleware')


router.post('/postUsers', IPAllowedMiddleware, TimeLockersMiddleware('users'), usersController.postUsersFrom1C)

module.exports = router
