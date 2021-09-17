require('dotenv').config()

exports = module.exports = {
    dbSettings: {
        db: process.env.DB_NAME,
        user: process.env.DB_USER,
        pwd: process.env.DB_PASSWORD,
        // ----- Если используем локальное подключение -----
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
        // ----- Если используем репликацию -----
        // replica:{
        //     name: process.env.DB_REPLICA_NAME,
        //     members:["",""]
        // }

    },
    port: process.env.PORT,
    host: process.env.HOST,
    timeLock: process.env.TIMELOCK,
    prefixUsers: 'U',
    prefixReplacements: 'R',
    prefixSubdivisions: 'S'
}
