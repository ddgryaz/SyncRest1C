const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'SyncRest1C',
            description: 'Сервис для получения данных из 1С',
            contact: {
                "name": "API Developer",
                "email": "dzyuman@ans.aero"
            },
        }
    },
    apis: ['./routes/*.js']
}

module.exports = swaggerOptions
