/*
1.返回值是一个函数
*/
export function debounce(callback,time){
    let timeId = null;
	return function(event){//防抖一般用于事件绑定,所以需要接受event
        if(timeId!== null){//说明已经开启了一个定时器，所以需要清空上一次的
            clearTimeout(timeId);
        }
		/*
        启动定时器,定时器执行后里面的回调是异步执行的
        setTimeout返回值是立即返回的
		*/
        timeId = setTimeout(()=>{
            console.log('执行时的timeId:'+timeId);    
			callback.call(this,event);
            //执行成功之后，重置timeId
            timeId = null;
		},time)
       
	}
}