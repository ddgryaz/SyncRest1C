/* global mdb */
const ApiError = require('../error/ApiErorr')
const moment = require("moment");
const path = require("path");
const log = require('../utils/log')

class UsersController {
    async postUsersFrom1C(req, res, next) {
        try {
            await mdb.collection('timeLockers').insertOne({
                createdAt: new Date(),
                endpoint: 'users'
            })
            const {json} = req.files
            let fileName = moment(new Date()).format('YYMMDDhmm')
            await json.mv(path.resolve(__dirname, '..', 'static', 'U' + fileName+ '.json'))
            log('JSON upload successfully. Transfer to the service')
            return res.json(`Upload is success`)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UsersController()
