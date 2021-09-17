/* global mdb */
const ApiError = require('../error/ApiErorr')
const moment = require("moment");
const path = require("path");
const log = require('../utils/log')
const syncDataService = require('../service/syncDataService')
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
            const {subdivisions} = req.files
            const {replacements} = req.files
            let fileName = moment(new Date()).format('YYMMDDhhmmss')
            await users.mv(path.resolve(__dirname, '..', 'JSON', 'data', settings.prefixUsers + fileName+ '.json'))
            await subdivisions.mv(path.resolve(__dirname, '..', 'JSON', 'data', settings.prefixSubdivisions + fileName+ '.json'))
            await replacements.mv(path.resolve(__dirname, '..', 'JSON', 'data', settings.prefixReplacements + fileName+ '.json'))
            log('JSONs data loaded successfully. Transfer to the service')
            /*
                ! Вызовем сервис. Ждать не будем, вернем респонс
             */
            syncDataService(fileName).then(() => {
                log('syncDataService worked successfully')
            }, (reason => log(`SYNCDATASERVICE ERROR: ${reason}`)))
            return res.json(`Upload is success`)
        } catch (e) {
            log(`syncDataFrom1CWithMongo ERROR: ${e}`)
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new DataController()
