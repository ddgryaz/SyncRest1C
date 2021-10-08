const {getFileExt} = require('../middleware/validateReqMiddleware')

describe('getFileExt', () => {
    test('returned ext file from string', () => {
        expect(getFileExt('setup.exe')).not.toBeFalsy()
        expect(getFileExt('mockData.json')).toBe('json')
        expect(getFileExt('mockData.JsOn')).toBe('JsOn')
        expect(getFileExt('setup.epe.exe')).toBe('exe')
        expect(getFileExt('setup')).toBe('setup')
    })
})
