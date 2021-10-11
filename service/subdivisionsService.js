/* global mdb, mdbClient */
const settings = require("../settings");
const log = require("../utils/log");
const hash = require('object-hash');
const getActivePeoples = require('../utils/getActivePeoples')
const getDismissedPeoples = require('../utils/getDismissedPeoples')
const findStringInObject = require('../utils/findStringInObject')


const workDirectory = settings.workDirectory


module.exports = async function (fileName) {
    try {
        const file = require(`${workDirectory}` + settings.prefixSubdivisions + `${fileName}` + '.json')
        const modifiedSubs = []
        for (let i = 0; file[i]; i++) {
            const sub = file[i]
            const id = file[i].subunitGuid
            const subName = file[i].prettyName
            /*
            * В тюменском филиале, в данных есть дубли. В 1С хранятся не актуальные данные
            * с пометкой (Не исп.). С помощью рекурсии пробежимся по объекту, проверим наличие такой пометки.
             */
            if (await findStringInObject("(Не исп.)", file[i])) {
                continue
            }
            const metaSubunit = await mdb.collection('metaSubdivisions').findOne({
                subunitGuid: id
            })
            if (metaSubunit) {
                const compareSub = (hash(sub) === metaSubunit.hash)
                if (!compareSub) {
                    sub.hash = hash(sub)
                    await mdb.collection('metaSubdivisions').updateOne({subunitGuid: id}, {
                        $set: sub
                    })
                    log(`${subName} Modified!`)
                    modifiedSubs.push(id)
                }
            } else {
                sub.hash = hash(sub)
                await mdb.collection('metaSubdivisions').updateOne({subunitGuid: id}, {
                    $set: sub
                }, {
                    upsert: true
                })
                log(`${subName} Added!`)
                modifiedSubs.push(id)
            }
        }
        if (modifiedSubs.length === 0) {
            log(`SubdivisionsService No changes. Nothing to update`)
        } else {
            log(`Synchronizing ${modifiedSubs.length} subdivisions with Mongo...`)
            for (let i = 0; modifiedSubs[i]; i++) {
                const sub = await mdb.collection('metaSubdivisions').findOne({
                    subunitGuid: modifiedSubs[i]
                })

                const newInfo = {
                    _id: sub.subunitGuid,
                    activePeople: await getActivePeoples(sub.subunitGuid),
                    guid: sub.subunitGuid,
                    guidParent: sub.parentGuid,
                    caption: sub.prettyName,
                    shortName: sub.subunit,
                    dismissedPeoples: await getDismissedPeoples(sub.subunitGuid),
                    level: sub.level,
                    parent: sub.parentGuid ? sub.parentGuid : null,
                    peoplePosition: sub.peoplePosition
                }
                if (newInfo.peoplePosition === false) {
                    delete newInfo.peoplePosition
                }
                await mdbClient.db('Auth').collection('structure').updateOne({
                    _id: newInfo._id
                }, {
                    $set: newInfo
                }, {
                    upsert: true
                })
            }
        log('Subdivisions Service result: successfully!')
        }
    } catch (e) {
        log(`SubdivisionsService ERROR: ${e}`)
    }
}
