function clone1(target) {
    //深浅拷贝针对对象
    if(typeof target ==='object' && target !==null){
        if(Array.isArray(target)){
            return [...target];
        }else{
            return {...target}
        }
    }else {
        return target;
    }
    
}

function clone2(target) {
    if(typeof target ==='object' && target !==null){
        //创建一个容器
        const result = Array.isArray(target)?[]:{};
        //for in 既可以遍历数组也可以遍历对象，但是他会遍历原型上的方法
        for (let key in target) {
            if (target.hasOwnProperty(key)) {
                result[key] = target[key];  
            }
        }
        return result;
    }
    else{
        return target;
    }
}

function deepClone1(target) {
    //通过数组创建JSON格式的字符串
    let str = JSON.stringify(target);
    //将JSON格式的字符串转换为JS数据
    let data = JSON.parse(str);
    return data;
}

//递归
function deepClone2(target) {
    if(typeof target ==='object' && target !==null){
        const result = Array.isArray(target)?[]:{};
        for (let key in target) {//检测是否本身的元素
            if (target.hasOwnProperty(key)) {
                result[key] = deepClone2(key);
            }
        }
        return result;
    }else{
        return target;
    }
}
//加入Map保证克隆过的不再克隆
function deepClone2(target,map=new Map()) {
    if(typeof target ==='object' && target !==null){
        //先判断是否已经克隆过了
        let cloneLet = map.get(target);
        if(cache)return cache;
        const result = Array.isArray(target)?[]:{};
        //key为原对象，result为克隆的对象，如果克隆过则直接取克隆之后的对象就可以了
        map.set(target,result);
        for (let key in target) {//检测是否本身的元素
            if (target.hasOwnProperty(key)) {
                result[key] = deepClone3(key,map);
            }
        }
        return result;
    }else{
        return target;
    }
}

//遍历优化
function deepClone3(target,map=new Map()) {
    if(typeof target ==='object' && target !==null){
        //先判断是否已经克隆过了
        let cloneLet = map.get(target);
        if(cache)return cache;
        let isAtrray = Array.isArray(target);
        const result = isAtrray?[]:{};
        //key为原对象，result为克隆的对象，如果克隆过则直接取克隆之后的对象就可以了
        map.set(target,result);
        if(isAtrray){
            target.forEach((item,index)=>{
                result[index] = deepClone3(item,map);
            })
        }else{
            Object.keys(target).forEach((key,index)=>{
                result[key] = deepClone3(target[key]);
            })
        }
        return result;
    }else{
        return target;
    }
}

