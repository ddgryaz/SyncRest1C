const makeDate = require('../utils/makeDate')

test('makeDate returned new Date object', () => {
    expect(makeDate('01.04.2021 0:00:00')).toBeDefined()
    expect(makeDate('01.04.2021 0:00:00')).toBeInstanceOf(Date)
    expect(makeDate('01.04.2021 0:00:00')).toEqual(new Date('2021-04-01T00:00:00.000Z'))
})
