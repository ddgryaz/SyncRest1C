/* global mdb */
const ApiError = require('../error/ApiErorr')
const moment = require("moment");
const path = require("path");
const log = require('../utils/log')
const usersJSONService = require('../service/usersJSONService')

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
            let fileName = moment(new Date()).format('YYMMDDhmm')
            await json.mv(path.resolve(__dirname, '..', 'static', 'users', 'U' + fileName+ '.json'))
            log('JSON upload successfully. Transfer to the service')
            /*
                ! Вызываем и передаем аргументы в асинхронный сервис, не указывая await.
                ! Сервис продолжает работать, в то время как 1С уже получит response.
             */
            usersJSONService(fileName).then(() => {
                log('Users Service worked successfully')
            }, (reason => log(`USERS SERVICE ERROR: ${reason}`)))
            return res.json(`Upload is success`)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UsersController()
