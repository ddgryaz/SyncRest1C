/* global mdb */
const ApiError = require('../error/ApiErorr')
const moment = require("moment");
const path = require("path");

class UsersController {
    async postUsersFrom1C(req, res, next) {
        try {
            const {json} = req.files
            let fileName = moment(new Date()).format('YYYYMMDD')
            await json.mv(path.resolve(__dirname, '..', 'static', fileName+ '.json'))
            // await mdb.collection('timeLockers').insertOne({
            //     createdAt: new Date(),
            //     endpoint: 'users'
            // })
            return res.json(`Parser started ...`)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UsersController()
