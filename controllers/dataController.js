/* global mdb */
const ApiError = require('../error/ApiErorr')
const moment = require("moment");
const path = require("path");
const log = require('../utils/log')
const usersJSONService = require('../service/usersJSONService')
const settings = require("../settings");

class DataController {
    async syncDataFrom1CWithMongo(req, res, next) {
        try {
            /*
                * Установим таймлокер, чтобы
                * в ближайшее время на этот эндпоинт не могли стучать
             */
            // await mdb.collection('timeLockers').insertOne({
            //     createdAt: new Date(),
            //     endpoint: 'dataFrom1C'
            // })
            const {users} = req.files
            let fileName = moment(new Date()).format('YYMMDDhhmmss')
            await users.mv(path.resolve(__dirname, '..', 'JSON', 'data', settings.prefixUsers + fileName+ '.json'))
            log('JSON with USERS upload successfully. Transfer to the service')
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

module.exports = new DataController()
