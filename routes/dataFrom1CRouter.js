const Router = require('express')
const router = new Router
const dataController = require('../controllers/dataController')
const IPAllowedMiddleware = require('../middleware/IPAllowedMiddleware')
const TimeLockersMiddleware = require('../middleware/TimeLockersMiddleware')
const {validateReqMiddleware} = require('../middleware/validateReqMiddleware')

/**
 * @swagger
 * /api/data/postData:
 *  post:
 *    tags: [Приём данных]
 *    description: Эндпоинт на приём 3ёх файлов выгрузки из 1С.
 *    summary: Uploads a files.
 *    consumes:
 *      - multipart/form-data
 *    parameters:
 *      - in: formData
 *        name: users
 *        type: file
 *        description: Выгрузка с людьми
 *        required: true
 *      - in: formData
 *        name: subdivisions
 *        type: file
 *        description: Выгрузка с подразделениями
 *        required: true
 *      - in: formData
 *        name: replacements
 *        type: file
 *        description: Выгрузка с замещениями
 *        required: true
 *    responses:
 *      '200':
 *        description: Upload is success (Запрос прошел успешно)
 *      '415':
 *        description: Expected 3 files (При загрузке файлов, обратите внимание на поля Name в Parameters и на количество файлов. Или файл(ы) не .json)
 *      '400':
 *        description: Bad Request (Сервис не понял ваш запрос)
 *      '403':
 *        description: Permission Denied (IP адрес с которого отправляют файлы, не входит в список разрешенных)
 *      '405':
 *        description: TimeLocker detected (Файлы уже были отправлены некоторое время назад, новые входящие запросы обрываются. Время для таймлокера регулируется в настройках сервиса)
 *      '500':
 *        description: Internal Server Error (Что-то сломалось?)
 *
 */
router.post('/postData',
    IPAllowedMiddleware,
    validateReqMiddleware,
    // TimeLockersMiddleware('dataFrom1C'),
    dataController.syncDataFrom1CWithMongo
)
module.exports = router
