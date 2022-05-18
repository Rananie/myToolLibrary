/**
* 数组扁平化
* @param {Array} arr 
*/
function flatten(arr) {
    while(arr.some(item=>Array.isArray(item))) {
            console.log(...arr);
            arr = [].concat(...arr);
            console.log(arr);
    }
    return arr;
}
function flatten1(arr) {
    let result = [];
    arr.forEach(item=>{
        //递归返回的是一个一维数组，所以使用concat进行连接，concat连接返回新数组
        if(Array.isArray(item))result = result.concat(flatten1(item));
        else  result = result.concat(item);
    })
    return result;
}
