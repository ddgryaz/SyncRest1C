/* global mdb, mdbClient */
const settings = require("../settings")
const cLogs = require('clogsjs')
const hash = require('object-hash')
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
                    cLogs(`${subName} Modified!`)
                    modifiedSubs.push(id)
                }
            } else {
                sub.hash = hash(sub)
                await mdb.collection('metaSubdivisions').updateOne({subunitGuid: id}, {
                    $set: sub
                }, {
                    upsert: true
                })
                cLogs(`${subName} Added!`)
                const checkSub = await mdbClient.db('Auth').collection('structure').findOne({
                    _id: id
                })
                if (checkSub) {
                    cLogs('Subdivision already exists in the Auth collection', 'yellow')
                } else {
                    modifiedSubs.push(id)
                }
            }
        }
        if (modifiedSubs.length === 0) {
            cLogs(`SubdivisionsService No changes. Nothing to update`, 'yellow')
        } else {
            cLogs(`Synchronizing ${modifiedSubs.length} subdivisions with Mongo...`, 'green')
            for (let i = 0; modifiedSubs[i]; i++) {
                const sub = await mdb.collection('metaSubdivisions').findOne({
                    subunitGuid: modifiedSubs[i]
                })

                const newInfo = {
                    _id: sub.subunitGuid,
                    activePeople: await getActivePeoples(sub.subunitGuid) || 0,
                    guid: sub.subunitGuid,
                    guidParent: sub.parentGuid,
                    caption: sub.prettyName,
                    shortName: sub.subunit,
                    dismissedPeoples: await getDismissedPeoples(sub.subunitGuid) || 0,
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
        cLogs('Subdivisions Service result: successfully!', 'green')
        }
    } catch (err) {
        cLogs(`SubdivisionsService ERROR: ` + err.toString(), 'red')
    }
}
