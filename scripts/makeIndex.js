const MinimalMongodb = require('MinimalMongodb')
const settings = require("../settings");
const cLogs = require('clogsjs')

const timeLock = settings.timeLock || (60 * 60) // 1h


async function start () {
    const dbConnector = new MinimalMongodb(settings.dbSettings)
    const mdb = await dbConnector.connect()
    await mdb.collection('metaReplacements').createIndex({ 'docGuid': 1 })
    await mdb.collection('metaSubdivisions').createIndex({ 'subunitGuid': 1 })
    await mdb.collection('metaUsers').createIndex({ 'guid': 1 })
    await mdb.collection('allowIps').createIndex({ 'ip': 1 })
    await mdb.collection('timeLockers').createIndex({ 'createdAt': 1 }, { expireAfterSeconds: Number(timeLock) })
    await dbConnector.client.close()
    cLogs(`Timelock is set to ${timeLock} seconds`, 'yellow')
}


start().then(() => {
    cLogs('FINISH! Indexes created!', 'green')
    process.exit(0)
}).catch((err) => {
    cLogs('ERROR: ' + err.toString(), 'red')
    process.exit(1)
})
