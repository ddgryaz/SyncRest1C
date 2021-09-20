function cleanObj (obj) {
    const endPosition = obj.length - 1
    // Уберем родителя у самого верхнего уровня
    obj[0].parent = null
    // id сделаем в _id и уберем peoplePosition везде кроме самого нижнего уровня
    for (let i = 0; obj[i]; i++) {
        if (i !== endPosition) {
            obj[i]._id = obj[i].id
            delete obj[i].id
            delete obj[i].peoplePosition
        } else {
            obj[i]._id = obj[i].id
            delete obj[i].id
            break
        }

    }
}

module.exports = cleanObj
