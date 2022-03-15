/* global mdb */
const ApiError = require('../error/ApiErorr')
const moment = require("moment");
const path = require("path");
const cLogs = require('clogsjs')
const syncDataService = require('../service/syncDataService')
const settings = require("../settings")


class DataController {
    async syncDataFrom1CWithMongo(req, res, next) {
        try {
            /*
                * Установим таймлокер, чтобы
                * в ближайшее время на этот эндпоинт не могли стучать
             */
            await mdb.collection('timeLockers').insertOne({
                createdAt: new Date(),
                endpoint: 'dataFrom1C'
            })
            const {users} = req.files
            const {subdivisions} = req.files
            const {replacements} = req.files
            let fileName = moment(new Date()).format('YYMMDDhhmmss')
            await users.mv(path.resolve(__dirname, '..', 'JSON', 'data', settings.prefixUsers + fileName+ '.json'))
            await subdivisions.mv(path.resolve(__dirname, '..', 'JSON', 'data', settings.prefixSubdivisions + fileName+ '.json'))
            await replacements.mv(path.resolve(__dirname, '..', 'JSON', 'data', settings.prefixReplacements + fileName+ '.json'))
            cLogs('JSONs data loaded successfully. Transfer to the service', 'green')
            /*
                ! Вызовем сервис. Ждать не будем, вернем респонс
             */
            syncDataService(fileName).then(() => {
                cLogs('syncDataService worked successfully!', 'green')
                cLogs('The import is complete. Expecting the next request', 'green')
            }, (reason => cLogs(`SYNCDATASERVICE ERROR: ${reason}`, 'red')))
            return res.json(`Upload is success`)
        } catch (err) {
            cLogs(`syncDataFrom1CWithMongo ERROR: ` + err.toString(), 'red')
            next(ApiError.badRequest(err.message))
        }
    }
}

module.exports = new DataController()
