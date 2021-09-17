
const log = require("../utils/log");

module.exports = async function (req, res, next){
    if (req.method === 'OPTION'){
        next()
    }
    try {
        const data = req.files
        /*
        ! Проверку на длину, больше 3 не прокатит и тд
         */
        if (data.users && data.subdivisions && data.replacements) {
            log('Data valid success')
            next()
        } else {
            log('Data not validated. Cancel request')
            res.status(415).json({message: 'Expected 3 files: users, subdivisions, replacements.'})
        }
    } catch (e) {
        res.status(400).json({message: 'Bad Request'})
    }
}
