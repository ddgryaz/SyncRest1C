const moment = require("moment");

function log(message) {
    console.log(moment(new Date()).format('YYYY-MM-DD hh:mm a') + ' - ' + message)
}

module.exports = log
