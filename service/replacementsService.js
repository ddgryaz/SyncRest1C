/* global mdb, mdbClient */
const settings = require("../settings");
const log = require("../utils/log");
const hash = require('object-hash');
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
                    log(`${rep} Modified!`)
                    replacementsForMongo.push(guid)
                }
            } else {
                replace.hash = hash(replace)
                await mdb.collection('metaReplacements').updateOne({guid: guid}, {
                    $set: replace
                }, {
                    upsert: true
                })
                log(`${rep} Added!`)
                replacementsForMongo.push(guid)
            }
        }
        if (replacementsForMongo.length === 0) {
            log(`ReplacementsService No changes. Nothing to update`)
        }
        log('Replacements Service result: successfully!')
    } catch (e) {
        log(`Replacements Service ERROR: ${e}`)
    }
}
