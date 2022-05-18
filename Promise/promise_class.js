/*
自定义Promise函数模块:IIFE  立即执行函数暴露
1.定义整体结构
2.Promise构造函数
3.Promise.then()/catch()实现
4.Promise.all()/race()实现
5.Promise/resolveDelay()/rejecetDelay() 扩展
6.class版本
*/


(function (window) {
    /**
     * Promise构造器函数
     * @param {Function} excutor 同步执行的执行器函数
     */
    const PENDING='pending';
    const RESOLVED='resolved';
    const REJECTED='rejected';
    class Promise{
        constructor(executor){
            this.status = PENDING; //promise的状态；
            this.data = undefined;//用于存储结果数据
            this.callbacks=[];//[{onResolved(){},onRejected(){}},{onResolved(){},onRejected(){}}]
            //由于改变promise状态和指定回调函数的先后顺序没有要求，当先指定回调后改变状态时，需要先存回调函数   
            const self = this;//下面的2个情况,所以先保存起来
            function resolve(value) {
                if(self.status!==PENDING)return;
                self.status = RESOLVED;
                self.data = value;
                if(self.callbacks.length>0){
                        setTimeout(() => {//异步执行回调函数
                            self.callbacks.forEach(callbacksObj=>{
                            callbacksObj.onResolved(value); })
                        }, 0)
                }
            }
            function reject(reason) {
                if(self.status!==PENDING)return;
                self.status = REJECTED;
                self.data = reason;
                if(self.callbacks.length>0){
                        setTimeout(() => {//异步执行回调函数
                            self.callbacks.forEach(callbacksObj=>{
                            callbacksObj.onRejected(reason);})
                        }, 0);       
                }
            }
            //立即同步执行executor
            try {
                executor(resolve,reject);
            } catch (error) {//如果执行器抛出异常
                reject(error);
            }
        }
        then (onResolved,onRejected) {
            const self =this;
            //catch只会处理失败，所以成功的要继续向后传递成功
            onResolved =typeof onResolved==='function'?onResolved:value => value;
            //实现异常穿透
            onRejected =typeof onRejected==='function'?onRejected:reason =>{throw reason};
            //返回一个新的Promise对象
            return new Promise((resolve,reject)=>{
                //调用指定的回调函数
                function handle(callback) {
                    try {
                        const result = callback(self.data);//放在里面，放在外面这个会异步执行，返回获取不到，需要知道结果是什么
                        if(result instanceof Promise){//3
                        // result.then(
                         //    value => resolve(value), //如果这个执行说明返回的promise是成功的
                         //    reason=> reject(reason)//如果这个执行说明返回的promise是失败的
                         //    );//.then才知道promise是成功还是失败
                         result.then(resolve,reject);//简洁写法
                        }else {
                         resolve(result);
                        }
                     } catch (error) {                  
                         reject(error);//1
                     }
                }
                 //如果先指定回调，需要将回调函数保存起来,当执行回调时怎么修改当前Promise的状态？修改只能调用resolve或reject
                 if(self.status===PENDING){
                    self.callbacks.push({onResolved(value){
                        handle(onResolved);
                    },onRejected(reason){
                        handle(onRejected);
                    }});
                 } 
                 //如果先改变状态，后指定回调
                 else if(self.status===RESOLVED){
                    setTimeout(() => {
                        handle(onResolved);
                    });
                 }
                else{//如果是reject
                    setTimeout(() => {
                        handle(onRejected);
                     });
                }
            })
        }
        /**
        * Promise原型对象的catch()
        * @param {Function} onRejected  失败状态执行的回调函数
        * 返回一个新的Promise对象，该Promise的状态由catch的执行结果决定
        */
        catch (onRejected) {
            return this.then(undefined,onRejected);
        }
        /**
        * Promise函数的resolve方法
        * @param {*} value 
        * 返回一个成功的promise
        */
        static resolve(value) {
        return new Promise((resolve,reject)=>{
           if(value instanceof Promise){
                value.then(resolve,reject);
           }else resolve(value);
        })
        }
        /**
     * Promise函数的reject方法
     * @param {*} reason 
     * 返回一个失败的promise
     */
        static reject(reason) {
        return new Promise((resolve,reject)=>{
            reject(reason);
        })
        }
        /**
        * Promise函数的all方法
        * @param {Array} promises 
        * 返回一个promise，只要一个失败了立即返回失败的promise
        * 如果都成功时，值为一个成功值组成的数组
        * 如果有失败，值为第一个失败的promise值
        */
     static all (promises) {
        let count = 0;//用来表示成功promise的数量
        const values = new Array(promises.length);//用来保存所有成功value的数组
        return new Promise((resolve,reject)=>{
          promises.forEach((p,index) => {
              Promise.resolve(p).then(
                  value=>{
                    ++count;
                    values[index]=value;//需要按照promises数组的顺序放
                    //所有成功再执行resolve
                    if(count===promises.length){
                        resolve(values);
                    }
                  },
                  reason=>{
                      reject(reason);
                  }
              )
          });
        })
    }
        /**
     * Promise函数的race方法
     * @param {Array} promises 里面的元素可以是promise和数值，数值表示成功value
     * 返回一个promise，结果由第一个完成的promise决定
     */
         static race(promises) {
            return new Promise((resolve,reject)=>{
                promises.forEach((p,index) => {
                    Promise.resolve(p).then(
                        value=>{
                           resolve(value);
                        },
                        reason=>{
                            reject(reason);
                        }
                    )
                });
            })
        }
        /**
         * 延迟返回一个promise对象,在指定的时间后才确定结果
         * @param {*} value 
         * @param {*} time 
         */
        static resolveDelay (value,time) {
            return new Promise((resolve,reject)=>{
                setTimeout(() => {
                    if(value instanceof Promise){
                        value.then(resolve,reject);
                   }else resolve(value);
                }, time);    
             })
        }
        //延迟返回一个promise对象,在指定的时间后才确定结果
        static rejectDelay(reason,time){
            return new Promise((resolve,reject)=>{
                setTimeout(() => {
                    treject(reason);
                }, time);
                
            })
        }
    }

   

 
   

 

    //向外暴露Promise函数
    window.Promise=Promise;
})(window)