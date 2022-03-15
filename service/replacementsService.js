/* global mdb, mdbClient */
const settings = require("../settings")
const cLogs = require('clogsjs')
const hash = require('object-hash')
/*
TODO: сервис работает как заглушка, на текущий момент не понятно, что делать с данными.
    Пока будем просто хранить их в мета-коллекции.
 */
const workDirectory = settings.workDirectory

module.exports = async function (fileName) {
    try {
        const file = require(`${workDirectory}` + settings.prefixReplacements + `${fileName}` + '.json')
        let replacementsForMongo = []
        for (let i = 0; file[i]; i++) {
            const replace = file[i]
            const rep = file[i].ref
            const guid = file[i].docGuid
            const metaReplacement = await mdb.collection('metaReplacements').findOne({
                docGuid: guid
            })
            if (metaReplacement) {
                const compareRep = (hash(replace) === metaReplacement.hash)
                if (!compareRep) {
                    replace.hash = hash(replace)
                    await mdb.collection('metaReplacements').updateOne({docGuid: guid}, {
                        $set: replace
                    })
                    cLogs(`${rep} Modified!`)
                    replacementsForMongo.push(guid)
                }
            } else {
                replace.hash = hash(replace)
                await mdb.collection('metaReplacements').updateOne({guid: guid}, {
                    $set: replace
                }, {
                    upsert: true
                })
                cLogs(`${rep} Added!`)
                replacementsForMongo.push(guid)
            }
        }
        if (replacementsForMongo.length === 0) {
            cLogs(`ReplacementsService No changes. Nothing to update`, 'yellow')
        }
        cLogs('Replacements Service result: successfully!', 'green')
    } catch (err) {
        cLogs(`Replacements Service ERROR: ` + err.toString(), 'red')
    }
}
