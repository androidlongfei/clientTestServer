let getData = function (count) {
    let paging = []
    for (let i = 0; i < count; i++) {
        let num = i + 1
        paging.push(getItem(num))
    }
    return paging
}

let getItem = function (i) {
    return {
        title: 'hello',
        number: i,
        id: i,
        content: 'this is hello' + i + ' content'
    }
}

module.exports = {
    paging: getData(25)
}
