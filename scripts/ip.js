const settings = require('../settings.js')
const MinimalMongodb = require('MinimalMongodb')


async function start() {
    const dbConnector = new MinimalMongodb(settings.dbSettings)
    const mdb = await dbConnector.connect()
    const cmd = process.argv[2]
    const ip = process.argv[3] || '127.0.0.1'
    if (cmd === 'add') {
        console.log('add', ip)
        await mdb.collection('allowIps').insertOne({
            ip: ip,
        })
    } else if (cmd === 'delete') {
        console.log('delete', ip)
        await mdb.collection('allowIps').deleteOne({
            ip: ip,
        })
    }
    await dbConnector.client.close()
}start().then(() => {
    console.log('Finish')
}).catch((err) => {
    console.log('Error', err)
})
