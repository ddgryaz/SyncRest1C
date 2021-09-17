
const log = require("../utils/log");

module.exports = async function (req, res, next){
    if (req.method === 'OPTION'){
        next()
    }
    try {
        const data = req.files
        if (data.users && data.subdivisions && data.replacements) {
            log('Data valid success ')
            next()
        } else {
            log('Data not validated. Cancel request')
            res.status(404).json({message: 'Expected 3 files: users, subdivisions, replacements.'})
        }
    } catch (e) {
        res.status(404).json({message: 'Bad Request'})
    }
}
