/* global mdb */

const cLogs = require('clogsjs')
module.exports = function (endpointName) {
    return async function (req, res, next) {
        try {
            const endpoint = await mdb.collection('timeLockers').findOne({
                endpoint: endpointName
            })
            if (endpoint) {
                cLogs('Timelocker detected. Cancel request', 'yellow')
                return res.status(405).json({message: 'TimeLocker detected.'})
            }
            cLogs(`Timelocker not found. Accept the request`, 'green')
            next()
        } catch (e) {
            res.status(400).json({message: 'Bad Request'})
        }
    }
}
