/**
 * 数组分组
 * @param {Array} arr
 * @param {Number} size 
 */
function chunk(array,size){
    let result = [];
    let tmp = [];
    size = size||1;
    if(array.length<=size ||size===1){
        return array;
    }
    array.forEach((item) => {
        //先压入，因为为满在压入，那么最后不足size的元素将不会入栈
        if(tmp.length===0)result.push(tmp);
        tmp.push(item);
        if(tmp.length===size) tmp = [];
    });
    return result;
}