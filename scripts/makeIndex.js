require('dotenv').config()
const MinimalMongodb = require('MinimalMongodb')
const settings = require("../settings");
const log = require("../utils/log");

const timeLock = settings.timeLock || (60 * 2)//(60 * 60 * 2) // 2h

/*
TODO: Коллекции meta 3 штуки надо индексить
 */

async function start () {
    log(`Timelock is set to ${timeLock} seconds`)
    const dbConnector = new MinimalMongodb(settings.dbSettings)
    const mdb = await dbConnector.connect()
    await mdb.collection('allowIps').createIndex({ 'ip': 1 })
    await mdb.collection('timeLockers').createIndex({ 'createdAt': 1 }, { expireAfterSeconds: timeLock })
    await dbConnector.client.close()
}


start().then(() => {
    log('FINISH! Indexes created!')
    process.exit(0)
}).catch((err) => {
    log('ERROR', err.toString())
    process.exit(1)
})
