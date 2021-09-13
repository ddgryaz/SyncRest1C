/* global mdb */

module.exports = function (endpointName) {
    return async function (req, res, next) {
        if (req.method === 'OPTION') {
            next()
        }
        try {
            const endpoint = await mdb.collection('timeLockers').findOne({
                endpoint: endpointName
            })
            if (endpoint) {
                console.log('Timelocker detected. Cancel request')
                return res.status(405).json({message: 'Timelocker detected.'})
            }
            console.log(`Timelocker not found. Accept the request`)
            next()
        } catch (e) {
            res.status(404).json({message: 'Bad Request'})
        }
    }
}
