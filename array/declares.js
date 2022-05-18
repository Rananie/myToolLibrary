
/*
实现map
*/
function map(arr,callback) {
    let newArr = [];
    for(let i=0;i<arr.length;i++){
        newArr.push(callback(arr[i],i));
    }
    return newArr;
}

/*
实现reduce
*/
function reduce(arr,callback,initValue) {
    let result = initValue;//每次运行的结果，最开始是初始化
    for(let i=0;i<arr.length;i++){
        result=callback(result,arr[i],i);
    }
    return result;
}

/* 
实现filter()
*/
export function filter(array, callback) {

    const arr = []
    for (let index = 0; index < array.length; index++) {
      if (callback(array[index], index)) {
        arr.push(array[index])
      }
    }
    return arr
  }
  
/* 
实现find()
*/
export function find (array, callback) {
    for (let index = 0; index < array.length; index++) {
      if (callback(array[index], index)) {
        return array[index]
      }
    }
    return undefined
}

/* 
实现findIndex()
*/
export function findIndex (array, callback) {
    for (let index = 0; index < array.length; index++) {
      if (callback(array[index], index)) {
        return index
      }
    }
  return -1
}

 /* 
 实现every()
 */
 export function every (array, callback) {
    for (let index = 0; index < array.length; index++) {
      if (!callback(array[index], index)) { // 只有一个结果为false, 直接返回false
        return false
      }
    }
    return true
}

/* 
实现some()
*/
export function some (array, callback) {
    for (let index = 0; index < array.length; index++) {
      if (callback(array[index], index)) { // 只有一个结果为true, 直接返回true
        return true
      }
    }
    return false
}