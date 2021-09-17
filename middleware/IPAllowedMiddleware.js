/* global mdb */

const log = require("../utils/log");
module.exports = async function (req, res, next){
    if (req.method === 'OPTION'){
        next()
    }
    try {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const candidate = await mdb.collection('allowIps').findOne({
            ip: ip
        })
        if (!candidate && ip !== '127.0.0.1') {
            log(`Found post request. Candidate not found. Permission Denied. ${ip}`)
            return res.status(403).json({message: 'Permission Denied'})
        }
        log(`Found post request. Candidate confirmed, IP: ${ip}`)
        next()
    } catch (e) {
        res.status(400).json({message: 'Bad Request'})
    }
}
