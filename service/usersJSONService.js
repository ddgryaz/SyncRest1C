/* global mdb, mdbClient */
const settings = require("../settings");
const log = require("../utils/log");
const hash = require('object-hash');

const workDirectory = '../JSON/users/'

module.exports = async function (fileName) {
    try {
        const file = require(`${workDirectory}` + settings.prefixUsers + `${fileName}` + '.json')
        let wasChanges = false
        let newUsers = false
        let usersForMongo = []
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
                    log(`${username} Modified!`)
                    usersForMongo.push(username)
                    wasChanges = true
                }
            } else {
                user.hash = hash(user)
                await mdb.collection('metaUsers').updateOne({employee: username}, {
                    $set: user
                }, {
                    upsert: true
                })
                log(`${username} added!`)
                usersForMongo.push(username)
                newUsers = true
            }
        }
        if (!wasChanges && !newUsers) {
            log(`No changes. Nothing to update`)
        }
        if (wasChanges || newUsers) {
            log(`Synchronizing ${usersForMongo.length} users with mongo...`)
            for (let i = 0; usersForMongo[i]; i++) {
                const user = await mdb.collection('metaUsers').findOne({
                    employee: usersForMongo[i]
                })
                /*
                    ! Здесь НЕ создаём следующие объекты и массивы:
                    !   rights {}
                    !   editBound []
                    !   viewBound []
                 */
                /*
                  TODO:
                    Разобраться с _IDRRef
                 */
                const newInfo = {
                    _id: user._id,
                    disableDate: user.fired_date,
                    displayName: user.lastName + ' ' + user.firstName + ' ' + user.secondName,
                    dolgnost: user.position,
                    fam: user.lastName,
                    hierarchy: [],
                    ids: [user._id],
                    im: user.firstName,
                    mailConst: [],
                    ot: user.secondName,
                    tags: [],
                    telephoneNumberAnother: [],
                    telephoneNumberMobile: [],
                    words: [],
                    mail: [],
                    telephoneNumber: [],
                    dolgnostLast: null,
                    status: user.status,
                    tabNumber: user.tabNumber,
                    employmentDate: user.employmentDate
                }
                if (user.email) {
                    newInfo.mailConst.push(user.email)
                    newInfo.mail.push(user.email)
                }
                if (user.phoneNumber) {
                    newInfo.telephoneNumberMobile.push(user.phoneNumber)
                }
                const userInMongo = await mdbClient.db('Auth').collection('users').updateOne({
                    _id: user._id
                }, {
                    $set: newInfo
                }, {
                    upsert: true
                })
            }
        }
    } catch (e) {
        log(`UsersService ERROR: ${e}`)
    }

}
