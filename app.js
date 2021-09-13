const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const router = require('./routes/index')
const MinimalMongodb = require('MinimalMongodb')
const settings = require("./settings");
const dbConnector = new MinimalMongodb(settings.dbSettings)
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json')
const path = require("path");
const fileUpload = require('express-fileupload')

const PORT = settings.port || 5267
const HOST = settings.host || '127.0.0.1'
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler)

const start = async () => {
    try {
        global.mdb = await dbConnector.connect()
        global.mdbClient = dbConnector.client
        app.listen(PORT, HOST, () => console.log(`APP STARTED ON ${HOST}:${PORT}`))
    } catch (e) {
        console.log('ERROR START APP ' + e)
    }
}


start()
