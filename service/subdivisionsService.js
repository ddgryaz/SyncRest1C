/* global mdb, mdbClient */
const settings = require("../settings");
const log = require("../utils/log");
const hash = require('object-hash');
const PrepareWords = require("PrepareWords");


const workDirectory = settings.workDirectory


module.exports = async function (fileName) {
    try {
        const file = require(`${workDirectory}` + settings.prefixSubdivisions + `${fileName}` + '.json')
        const modifiedSubs = []
        for (let i = 0; file[i]; i++) {
            const sub = file[i]
            const guid = file[i].subunitGuid
            const subName = file[i].prettyName
            const metaSubunit = await mdb.collection('metaSubunit').findOne({
                subunitGuid: guid
            })
            if (metaSubunit) {
                const compareSub = (hash(sub) === metaSubunit.hash)
                if (!compareSub) {
                    sub.hash = hash(sub)
                    await mdb.collection('metaSubunit').updateOne({subunitGuid: guid}, {
                        $set: sub
                    })
                    log(`${subName} Modified!`)
                    modifiedSubs.push(guid)
                }
            } else {
                sub.hash = hash(sub)
                await mdb.collection('metaSubunit').updateOne({subunitGuid: guid}, {
                    $set: sub
                }, {
                    upsert: true
                })
                log(`${subName} Added!`)
                modifiedSubs.push(guid)
            }
        }
        if (modifiedSubs.length === 0) {
            log(`No changes. Nothing to update`)
        } else {
            log(`Synchronizing ${modifiedSubs.length} subunit with Mongo...`)
        }
    } catch (e) {

    }
}
