
function setObjToStr(arr) {
    const str = arr.map(item => JSON.stringify(item))
    return str.join('xdy')
}
function getStrToObj(item) {
    return item.split('xdy').map(item => JSON.parse(item))
}
function setArrToStr(item) {
    return item.join('xdy')
}
function getStrToArr(item) {
    return item.split('xdy')
}
module.exports = {
    setObjToStr, getStrToObj, getStrToArr, setArrToStr
}