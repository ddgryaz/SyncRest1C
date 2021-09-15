/* global mdb */
const ApiError = require('../error/ApiErorr')
const moment = require("moment");
const path = require("path");
const log = require('../utils/log')
const usersJSONService = require('../service/usersJSONService')
const settings = require("../settings");

class UsersController {
    async postUsersFrom1C(req, res, next) {
        try {
            /*
                * Установим таймлокер, чтобы
                * в ближайшее время на этот эндпоинт не могли стучать
             */
            // await mdb.collection('timeLockers').insertOne({
            //     createdAt: new Date(),
            //     endpoint: 'users'
            // })
            const {json} = req.files
            let fileName = moment(new Date()).format('YYMMDDhmmss')
            await json.mv(path.resolve(__dirname, '..', 'JSON', 'users', settings.prefixUsers + fileName+ '.json'))
            log('JSON upload successfully. Transfer to the service')
            /*
                ! Вызовем сервис. Ждать не будем, вернем респонс
             */
            usersJSONService(fileName).then(() => {
                log('Users Service worked successfully')
            }, (reason => log(`USERS SERVICE ERROR: ${reason}`)))
            return res.json(`Upload is success`)
        } catch (e) {
            log(`UsersController ERROR: ${e}`)
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UsersController()
