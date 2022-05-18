/*
1.定义上一次时间，判断执行的时间和上一次时间的时间间隔
2.满足条件，执行回调函数
*/
export function throttle(callback,wait){
    let pre = 0;
    return function(event){
         //Dom事件回调的函数里this是发生事件的标签
         //节流函数/真正的事件回调函数
        const current = Date.now(); //当前时间
         //事件触发后，节流函数也会被返回，只是满足一定的条件再调用
        if (current - pre > wait) { //只有离上一次调用callback的时间差大于wait
         //callback()是window调用的，所以callback函数里的this是window,这里要修改指向事件源
        callback.call(this,event); 
         //记录此次调用的时间
        pre = current;
        }
    }
}
    
    
    