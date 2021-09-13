const ApiError = require('../error/ApiErorr')

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        res.status(err.status).json({message: err.message})
    }
    return res.status(500).json({message: 'Неизвестная ошибка'})
}
