/* global mdb, mdbClient */
const settings = require("../settings");
const log = require("../utils/log");
const hash = require('object-hash');
const PrepareWords = require("PrepareWords");

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
            const guid = file[i].guid
            const metaUser = await mdb.collection('metaUsers').findOne({
                guid: guid
            })
            if (metaUser) {
                const compareCandidate = (hash(user) === metaUser.hash)
                if (!compareCandidate) {
                    user.hash = hash(user)
                    await mdb.collection('metaUsers').updateOne({guid: guid}, {
                        $set: user
                    })
                    log(`${username} Modified!`)
                    usersForMongo.push(guid)
                    wasChanges = true
                }
            } else {
                user.hash = hash(user)
                await mdb.collection('metaUsers').updateOne({guid: guid}, {
                    $set: user
                }, {
                    upsert: true
                })
                log(`${username} Added!`)
                usersForMongo.push(guid)
                newUsers = true
            }
        }
        if (!wasChanges && !newUsers) {
            log(`No changes. Nothing to update`)
        }
        if (wasChanges || newUsers) {
            log(`Synchronizing ${usersForMongo.length} users with Mongo...`)
            for (let i = 0; usersForMongo[i]; i++) {
                const user = await mdb.collection('metaUsers').findOne({
                    guid: usersForMongo[i]
                })
                /*
                    ! Здесь НЕ создаём следующие объекты и массивы:
                    ! rights {}
                    ! editBound []
                    ! viewBound []

                    * Такая история: в старом импорте существует поле _IDRRef,
                    * и с учетом этого поля уже выстроен сервис авторизации,
                    * поэтому создадим это поле, пихнём туда GUID.
                    * Немного справки(но это не точно): _IDRRef - бинарник,
                    * который создаётся в 1С - является уникальным id для любых объектов.
                 */
                 /* TODO:
                        Собирать - hierarchy.
                        Мэйби, чтобы данные не становились пустышками юзать ...prev ?
                        Даты === даты, а не строки!!!
                        stateStartDate пустые строки сделать null
                        stateExpirationDate пустые строки сделать null
                 */
                const newInfo = {
                    _id: user._id,
                    _IDRRef: user.guid,
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
                    //birthday: user.birthday,
                    telephoneNumberAnother: [],
                    telephoneNumberMobile: [],
                    words: [],
                    mail: [],
                    telephoneNumber: [],
                    dolgnostLast: null,
                    status: user.status,
                    tabNumber: user.tabNumber,
                    employmentDate: user.employmentDate,
                    statusStartDate: user.stateStartDate,
                    stateEndDate: user.stateExpirationDate
                }

                const pWords=new PrepareWords(newInfo.words)

                if (user.email) {
                    newInfo.mailConst.push(user.email)
                    newInfo.mail.push(user.email)
                    pWords.fromString(user.email)
                }
                if (user.phoneNumber) {
                    // Отредактировать регулярками на трубку
                    newInfo.telephoneNumberMobile.push(user.phoneNumber)
                    pWords.fromString(user.phoneNumber)
                }
                pWords.fromString(newInfo.displayName)
                    .fromString(newInfo.dolgnost)
                    .fromString(newInfo.status)
                    .fromString(newInfo.tabNumber)
                //.fromDate(newInfo.birthday)

                // tags[] - состоит из caption в иерархии, заполним массив и докинем в words[]:
                // newInfo.hierarchy.forEach((structEl) => {
                //     pWords.fromString(structEl.caption)
                //     newInfo.tags.push(structEl.caption)
                // })

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
