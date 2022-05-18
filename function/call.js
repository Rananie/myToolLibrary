
/*
1.给obj添加临时方法Fn
2.调用Fn,传入参数，获取返回值
3.删除临时方法
*/
export function call(Fn,obj,...arg) {
    if(obj === undefined || obj ===null)obj=globalThis;
    obj.tmp = Fn;
    let result = obj.tmp(...arg);
    delete obj.tmp;
    return result;
}
