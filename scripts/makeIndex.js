const MinimalMongodb = require('MinimalMongodb')
const settings = require("../settings");
const log = require("../utils/log");

const timeLock = settings.timeLock || (60 * 60) // 1h


async function start () {
    log(`Timelock is set to ${timeLock} seconds`)
    const dbConnector = new MinimalMongodb(settings.dbSettings)
    const mdb = await dbConnector.connect()
    await mdb.collection('metaReplacements').createIndex({ 'docGuid': 1 })
    await mdb.collection('metaSubdivisions').createIndex({ 'subunitGuid': 1 })
    await mdb.collection('metaUsers').createIndex({ 'guid': 1 })
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
