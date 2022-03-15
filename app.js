const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const router = require('./routes/index')
const MinimalMongodb = require('MinimalMongodb')
const settings = require("./settings")
const dbConnector = new MinimalMongodb(settings.dbSettings)
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const fileUpload = require('express-fileupload')
const cLogs = require('clogsjs')
swaggerOptions = require('./swaggerObj')

const PORT = settings.port || 5267
const HOST = settings.host || '127.0.0.1'
const swaggerDocs = swaggerJSDoc(swaggerOptions)

const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use('/api', router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(errorHandler)

const start = async () => {
    try {
        global.mdb = await dbConnector.connect()
        global.mdbClient = dbConnector.client
        app.listen(PORT, HOST, () => cLogs(`APP STARTED ON ${HOST}:${PORT}`, 'green'))
    } catch (err) {
        cLogs('ERROR START APP ' + err.toString(), 'red')
    }
}


start()
