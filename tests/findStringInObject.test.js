const findStringInObject = require('../utils/findStringInObject')

describe('findStringInObject testing', () => {

    const objectT = {
        "prettyName": "Техник по радионавигации, радиолокации и связи 1 категории",
        "subunit": "(Не исп.) Техник по радионавигации, радиолокации и связи 1 категории",
        "parent": "Технический отдел",
        "peoplePosition": true
    }
    const objectF = {
        "prettyName": "Техник по радионавигации, радиолокации и связи 1 категории",
        "subunit": "Техник по радионавигации, радиолокации и связи 1 категории",
        "parent": "Технический отдел",
        "peoplePosition": true
    }

    test('Returned True', () => {
        return findStringInObject('(Не исп.)', objectT).then(data => {
            expect(data).toBeDefined()
            expect(data).toBeTruthy()
        })
    })

    test('Returned False', () => {
        return findStringInObject('(Не исп.)', objectF).then(data => {
            expect(data).toBeDefined()
            expect(data).toBeFalsy()
        })
    })
})

