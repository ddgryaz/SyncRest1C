/* global mdb, mdbClient */
const settings = require("../settings");
const log = require("../utils/log");
const hash = require('object-hash');
const PrepareWords = require("PrepareWords");
const makeDate = require('../utils/makeDate')
const cleanObj = require('../utils/cleanObj')

const workDirectory = settings.workDirectory

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
                /*
                    * Если вдруг коллекцию мета удалили руками, проверим данные, чтобы не дублировать
                    * в основную коллекцию Auth
                 */
                const checkUser = await mdbClient.db('Auth').collection('users').findOne({
                    _IDRRef: user.guid
                })
                if (checkUser) {
                    log('User already exists in the Auth collection')
                } else {
                    usersForMongo.push(guid)
                    newUsers = true
                }
            }
        }
        if (!wasChanges && !newUsers) {
            log(`UsersService No changes. Nothing to update`)
        }
        if (wasChanges || newUsers) {
            log(`Synchronizing ${usersForMongo.length} users with Mongo...`)
            for (let i = 0; usersForMongo[i]; i++) {
                const user = await mdb.collection('metaUsers').findOne({
                    guid: usersForMongo[i]
                })

                // В реквесте мальца кривые данные, поправим их
                cleanObj(user.currentHierarchy)

                user.hierarchyHistory && user.hierarchyHistory.forEach((structEl) => {
                    structEl.startDate = makeDate(structEl.startDate)
                    structEl.endDate = makeDate(structEl.endDate)
                    cleanObj(structEl.hierarchy)
                })

                // У человека может быть работа по совместительству, поправим и ее
                user.currentPartTimeHierarchy && cleanObj(user.currentPartTimeHierarchy)


                /*
                    ! Здесь НЕ создаём следующие объекты и массивы:
                    ! rights {}

                    * Такая история: в старом импорте существует поле _IDRRef,
                    * и с учетом этого поля уже выстроен сервис авторизации,
                    * поэтому создадим это поле, пихнём туда GUID.
                    * Немного справки(но это не точно): _IDRRef - бинарник,
                    * который создаётся в 1С - является уникальным id для любых объектов.
                 */

                const newInfo = {
                    _id: user._id,
                    _IDRRef: user.guid,
                    disableDate: user.fired_date ? makeDate(user.fired_date) : null,
                    displayName: user.lastName + ' ' + user.firstName + ' ' + user.secondName,
                    dolgnost: user.position,
                    fam: user.lastName,
                    hierarchy: user.currentHierarchy,
                    hierarchyHistory: user.hierarchyHistory,
                    ids: [user._id],
                    im: user.firstName,
                    mailConst: [],
                    ot: user.secondName,
                    tags: [],
                    birthday: user.birthDate ? makeDate(user.birthDate) : null,
                    telephoneNumberAnother: [],
                    telephoneNumberMobile: [],
                    words: [],
                    mail: [],
                    telephoneNumber: [],
                    dolgnostLast: null, // вероятно когда то это можно использовать ...
                    status: user.state,
                    tabNumber: user.tabNumber,
                    employmentDate: user.employmentDate ? makeDate(user.employmentDate) : null,
                    statusStartDate: user.stateStartDate ? makeDate(user.stateStartDate) : null,
                    statusEndDate: user.stateExpirationDate ? makeDate(user.stateExpirationDate) : null,
                    partTimeHierarchy: user.currentPartTimeHierarchy,
                }

                const pWords = new PrepareWords(newInfo.words)

                if (user.email) {
                    newInfo.mailConst.push(user.email)
                    pWords.fromString(user.email)
                }
                if (user.phoneNumber) {
                    if (user.phoneNumber.length === 12 && /^\+79/.test(user.phoneNumber)) {
                        newInfo.telephoneNumberMobile.indexOf(user.phoneNumber) === -1 &&
                        newInfo.telephoneNumberMobile.push(user.phoneNumber)
                        pWords.fromString(user.phoneNumber)
                    } else {
                        newInfo.telephoneNumberAnother.push(user.phoneNumber)
                        pWords.fromString(user.phoneNumber)
                    }
                }

                pWords.fromString(newInfo.displayName)
                    .fromString(newInfo.dolgnost)
                    .fromString(newInfo.status)
                    .fromString(newInfo.tabNumber)
                    .fromDate(newInfo.birthday)

                // tags[] - состоит из caption в иерархии, заполним массив и докинем в words[]:
                newInfo.hierarchy.forEach((structEl) => {
                    pWords.fromString(structEl.caption)
                    newInfo.tags.push(structEl.caption)
                })

                newInfo.partTimeHierarchy && newInfo.partTimeHierarchy.forEach((structEl) => {
                    pWords.fromString(structEl.caption)
                    newInfo.tags.push(structEl.caption)
                })

                // В старом импорте таким образом выстраивали область записи и чтения, трогать не будем
                const ar = newInfo.hierarchy.concat([])
                newInfo.editBound = []
                newInfo.viewBound = []
                while (ar.length) {
                    const structItem = ar.pop()
                    newInfo.editBound.length < 2 && newInfo.editBound.push(structItem._id)
                    newInfo.viewBound.push(structItem._id)
                }
                // Если есть работа по совместительству, добавим ее в область чтения и записи по тому же принципу
                if (newInfo.partTimeHierarchy) {
                    const ar = newInfo.partTimeHierarchy.concat([])
                    while (ar.length) {
                        const structItem = ar.pop()
                        newInfo.editBound.length < 4 && newInfo.editBound.push(structItem._id)
                        newInfo.viewBound.push(structItem._id)
                    }
                }

                await mdbClient.db('Auth').collection('users').updateOne({
                    _IDRRef: user.guid
                }, {
                    $set: newInfo
                }, {
                    upsert: true
                })
            }
        log('Users Service result: successfully!')
        }
    } catch (e) {
        log(`UsersService ERROR: ${e}`)
    }

}
