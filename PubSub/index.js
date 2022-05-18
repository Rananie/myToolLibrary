const PubSub = {
    //订阅的唯一编号
    id:0,
    /*
    频道于回调保存容器，
    需要单个取消，同时执行，所以用对象保存pay:{token1:xx,token2:yy}
    */
    callbacks:{

    }
}

/*
订阅频道
*/
PubSub.subscribe = function (channel,callback) {
    let token = "token_" + this.id++;
    //先判断callbacks是不是已经有channel
    if(this.callbacks[channel]){
        this.callbacks[channel][token] = callback;
    }else{//如果没有使用上面this.callbacks[channel]就会找不到了undefined[token]
        this.callbacks[channel] ={
            [token]:callback
        }
    }
   return token;
}
/*
发布消息
*/
PubSub.publish = function (channel,data) {
        if(this.callbacks[channel]){
            Object.values(this.callbacks[channel]).forEach(callback => {
                callback(data)
            })
        }
}

/*
取消订阅
1.没有传值，取消所有
2.传入token字符串，取消对应的token订阅
3.msgName字符串，取消对应的频道
*/
PubSub.unsubscribe = function (flag) {
    if(flag===undefined){
        this.PubSub = {};
    }else if(typeof flag === 'string'){
        if(flag.indexOf('token_'===0)){//订阅id
           let callbackObj= Object.values(this.callbacks).find(obj =>obj.hasOwnProperty(flag));
            if(callbackObj){
                delete callbackObj[flag];
                this.id--;
            }
        }else{//频道的名称
            delete this.callback[flag];
        }
    }   
}
