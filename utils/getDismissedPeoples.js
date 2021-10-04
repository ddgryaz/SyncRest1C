async function getDismissedPeoples (id) {
    return await mdbClient.db('Auth').collection('users').countDocuments({
        $and: [{disableDate: {$ne: null}},
            {viewBound: {$in: [id]}}]
    })
}

module.exports = getDismissedPeoples
