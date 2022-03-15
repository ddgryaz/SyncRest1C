const settings = require('../settings.js')
const MinimalMongodb = require('MinimalMongodb')
const cLogs = require('clogsjs')


async function start() {
    const dbConnector = new MinimalMongodb(settings.dbSettings)
    const mdb = await dbConnector.connect()
    const cmd = process.argv[2]
    const ip = process.argv[3] || '127.0.0.1'
    if (cmd === 'add') {
        cLogs('ADD: ' + ip, 'green')
        await mdb.collection('allowIps').insertOne({
            ip: ip,
        })
    } else if (cmd === 'delete') {
        cLogs('DELETE: ' + ip, 'green')
        await mdb.collection('allowIps').deleteOne({
            ip: ip,
        })
    }
    await dbConnector.client.close()
}start().then(() => {
    cLogs('Finish', 'green')
}).catch((err) => {
    cLogs('Error: ' + err.toString(), 'red')
})
