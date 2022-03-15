/* global mdb */

const cLogs = require('clogsjs')
module.exports = async function (req, res, next){
    try {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const candidate = await mdb.collection('allowIps').findOne({
            ip: ip
        })
        if (!candidate) {
            cLogs(`Found post request. Candidate not found. Permission Denied. ${ip}`, 'yellow')
            return res.status(403).json({message: 'Permission Denied'})
        }
        cLogs(`Found post request. Candidate confirmed, IP: ${ip}`, 'green')
        next()
    } catch (e) {
        res.status(400).json({message: 'Bad Request'})
    }
}
