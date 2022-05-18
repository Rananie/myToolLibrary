
/*
1.新建一个对象resultObj
2.先把第一个对象放进去
3.在放第二个对象，如果此对象的键在resultObj里面有，则合并。没有则直接写入
*/
function mergerObject(...objs) {
    const resultObj = {};
    objs.forEach(obj=>{
        //获取当前对象的所有属性;
        Object.keys(obj).forEach(key=>{
             // 如果resultObjt还没有key值属性
             if(resultObj.hasOwnproperty(key)){
                 //如果有合并
                 resultObj[key] = [].concat(resultObj[key],obj[key]);
             }else{
                 //如果没有则直接写入
                resultObj[key] = obj[key];
             }
        })
    })
    return resultObj;
}