const userService = require('./usersService')
const subdivisionsService = require('./subdivisionsService')
const replacementsService = require('./replacementsService')

module.exports = async function (fileName) {
    /*
    * Апдейтим в таком порядке:
    * Подразделения
    * Юзеры
    * Замещения
     */
    // await subdivisionsService(fileName)
    await userService(fileName)
    // await replacementsService(fileName)
}