const {exec} = require('child_process')
const settings = require("../settings")

const days = settings.cleaner || 14

/*
    * Каждый запрос на сервис сохраняет на сервере 3 JSON файла
    * вес которых достигает в районе ~20-30 мб.
    * storageCleaner - для очистки места от старых данных.
    * Запускается после каждого запроса.
 */

function storageCleaner() {
    exec(`find ${__dirname}/../JSON/data/*.json -mtime +${days} -delete`)
}

module.exports = storageCleaner