function makeDate(str) {
    const year = str.split('.')[2].split(' ')[0]
    const month = str.split('.')[1]
    const day = str.split('.')[0]
    const newDate = `${year}-${month}-${day}Z`
    return new Date(new Date(newDate))
}

module.exports = makeDate
