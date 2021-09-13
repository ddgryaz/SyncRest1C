const MinimalMongodb = require('MinimalMongodb')
const settings = require("../settings");

const timeLock = (60 * 2)//(60 * 60 * 2) // 2h

async function start () {
    const dbConnector = new MinimalMongodb(settings.dbSettings)
    const mdb = await dbConnector.connect()
    await mdb.collection('allowIps').createIndex({ 'ip': 1 })
    await mdb.collection('timeLockers').createIndex({ 'createdAt': 1 }, { expireAfterSeconds: timeLock })
    await dbConnector.client.close()
}


start().then(() => {
    console.log('FINISH! Indexes created!')
    process.exit(0)
}).catch((err) => {
    console.log('ERROR', err.toString())
    process.exit(1)
})
