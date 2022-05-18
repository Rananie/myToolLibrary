/**
 * 删除数组元素
 * @param {Array} arr 
 * @param  {...any} args 
 */
function pull(arr,...args) {
    const result = [];
   for(let index=0;index<arr.length;++index){
      if(args.includes(arr[index])){
          result.push(arr[index]);
          arr.splice(index,1);
          index--;//splice删除一般需要小标自减
      }
   } 
    return result;
}
function pullAll(arr,values) {
    return pull(arr,...values);
}