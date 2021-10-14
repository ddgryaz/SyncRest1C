const {exec} = require('child_process')
const settings = require("../settings");

const days = settings.cleaner || 14

function storageCleaner() {
    exec(`find ${__dirname}/../JSON/data/*.json -mtime +${days} -delete`)
}

module.exports = storageCleaner