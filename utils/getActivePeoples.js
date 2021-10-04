async function getActivePeoples (id) {
    return await mdbClient.db('Auth').collection('users').countDocuments({
        $and: [{disableDate: {$eq: null}},
            {viewBound: {$in: [id]}}]
    })
}

module.exports = getActivePeoples
