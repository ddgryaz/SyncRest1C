const makeDate = require('../utils/makeDate')

test('makeDate returned new Date object', () => {
    expect(makeDate('01.04.2021 0:00:00')).toBeDefined()
    expect(makeDate('01.04.2021 0:00:00')).toBeInstanceOf(Date)
    expect(makeDate('01.04.2021 0:00:00')).toEqual(new Date('2021-04-01T00:00:00.000Z'))
    expect(makeDate('31.12.3999 23:59:59')).toBeDefined()
    expect(makeDate('31.12.3999 23:59:59')).toBeInstanceOf(Date)
    expect(makeDate('31.12.3999 23:59:59')).toEqual(new Date('3999-12-31T00:00:00.000Z'))
})
