/* 
语法: var new_array = concat(old_array, value1[, value2[, ...[, valueN]]]) 
功能: 将n个数组或值与当前数组合并生成一个新数组
*/
function cancat(arr,...args) {
    const result = [...arrr];
    args.forEach(item=>{
        if(Array.isArray(item))result.push(...item);
        else result.push(item);
    })
    return result;
}