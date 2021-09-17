/* global mdb */
const ApiError = require('../error/ApiErorr')
const moment = require("moment");
const path = require("path");
const log = require('../utils/log')
const subdivisionsJSONService = require('../service/subdivisionsJSONService')
const settings = require("../settings");

class subdivisionsController {
    async postSubdivisionsFrom1C(req, res, next) {
        try {
            // await mdb.collection('timeLockers').insertOne({
            //     createdAt: new Date(),
            //     endpoint: 'subdivisions'
            // })
            const {json} = req.files
            let fileName = moment(new Date()).format('YYMMDDhhmmss')
            await json.mv(path.resolve(__dirname, '..', 'JSON', 'subdivisions', settings.prefixSubdivisions + fileName+ '.json'))
            log('JSON with SUBDIVISIONS upload successfully. Transfer to the service')
            subdivisionsJSONService(fileName).then(() => {
                log('Subdivisions Service worked successfully')
            }, (reason => log(`SUBDIVISIONS SERVICE ERROR: ${reason}`)))
            return res.json(`Upload is success`)
        } catch (e) {
            log(`SubdivisionsController ERROR: ${e}`)
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new subdivisionsController()
