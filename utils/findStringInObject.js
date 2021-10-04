async function findStringInObject(str, obj) {
    const queue = [];
    for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
            if (typeof obj[k] === 'string') {
                if (obj[k].indexOf(str) !== -1) {
                    return true;
                }
            } else {
                queue.push(obj[k]);
            }
        }
    }
    if (queue.length) {
        for (let i = 0; i < queue.length; i++) {
            if (await findStringInObject(str, queue[i])) {
                return true;
            }
        }
    }
    return false;
}


module.exports = findStringInObject
