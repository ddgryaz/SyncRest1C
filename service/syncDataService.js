const userService = require('./usersService')
const subdivisionsService = require('./subdivisionsService')
const replacementsService = require('./replacementsService')

module.exports = async function (fileName) {
    /*
    ! Важно апдейтить сначала юзеров, ибо в подразделениях мы будем считать
    ! активных людей
     */
    await userService(fileName)
    // await subdivisionsService(fileName)
    // await replacementsService(fileName)
}
