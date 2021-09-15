/* global mdb */
const settings = require("../settings");
const log = require("../utils/log");
const hash = require('object-hash');

const workDirectory = '../JSON/users/'

module.exports = async function (fileName) {
    try {
        const file = require(`${workDirectory}` + settings.prefixUsers + `${fileName}` + '.json')
        for (let i = 0; file[i]; i++) {
            const user = file[i]
            const username = file[i].employee
            const metaUser = await mdb.collection('metaUsers').findOne({
                employee: username
            })
            if (metaUser) {
                const compareCandidate = (hash(user) === metaUser.hash)
                if (!compareCandidate) {
                    user.hash = hash(user)
                    await mdb.collection('metaUsers').updateOne({employee: username}, {
                        $set: user
                    })
                    log(`${username} Modified`)
                }
            } else {
                user.hash = hash(user)
                await mdb.collection('metaUsers').updateOne({employee: username}, {
                    $set: user
                }, {
                    upsert: true
                })
                log(`${username} added!`)
            }
        }
    } catch (e) {
        log(`UsersService ERROR: ${e}`)
    }

}
