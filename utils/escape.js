function escape(data) {
    for (const key in data) {
        data[key] = escape(data[key])
    }
    return data
}
function unescape(data) {
    return data.map(item => {
        for (const key in item) {
            item[key] = unescape(item[key])
        }
        return item
    })
}
module.exports = {
    escape, unescape
}