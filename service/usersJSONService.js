/* global mdb */
const settings = require("../settings");
const log = require("../utils/log");


const workDirectory = '../JSON/users/'

module.exports = async function(fileName) {
    try {
        const file = require(`${workDirectory}` + settings.prefixUsers + `${fileName}` + '.json')
        console.log(file.length)
        for (let i = 0; file[i]; i++){
            const user = file[i]
            const username = file[i].employee
            await mdb.collection('metaUsers').updateOne({employee: username},{
                $set: user
            }, {
                upsert: true
            })
        }
    } catch (e) {
        log(`UsersService ERROR: ${e}`)
    }

}
