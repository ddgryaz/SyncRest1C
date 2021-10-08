const log = require("../utils/log");

const getFileExt = (string) => {
    return string.split('.').pop()
}

module.exports = async function (req, res, next) {
    try {
        const data = req.files
        const withoutSymbolLength = Object.keys(data)
        if (!data.users || !data.subdivisions || !data.replacements || withoutSymbolLength.length !== 3) {
            log('Data not validated. Cancel request')
            res.status(415).json({message: 'Expected 3 files: users, subdivisions, replacements.'})
        } else {
            if (getFileExt(data.users.name).toLowerCase() !== 'json'
                || getFileExt(data.subdivisions.name).toLowerCase() !== 'json'
                || getFileExt(data.replacements.name).toLowerCase() !== 'json') {
                log('Middleware failed to validate json. Cancel request')
                res.status(415).json({message: 'Json files is expected on input'})
            } else {
                log('Data valid success')
                next()
            }
        }
    } catch (e) {
        res.status(400).json({message: 'Bad Request'})
    }
}

module.exports = {getFileExt}
