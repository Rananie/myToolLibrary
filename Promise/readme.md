@[toc]
# Promise自定义

贯穿全文的2个点
1.promise的执行结果通过.then获取
2.promise的状态改变只有三种可能性 -- 关键问题1

## 关键问题
### 关键问题1 如何改变promise的状态?
1.执行resolve(value): 如果是pending就会变为resolved
2.执行reject(reason): 如果是pending就会变为rejected
3.抛出异常(可以抛出任何对象 ) throw new Error(message) :如果当前是pending就会变成rejected

### 关键问题2 一个promise指定多个成功/失败回调函数，都会调用吗？

当promise改变为对应状态时都会调用


### 关键问题3 改变promise状态和指定回调函数谁先谁后？
>改变promise状态指的是执行器中的resolve或reject调用
指定数据说的是resolve或reject调用时的传参
指定回调是then里指定的成功时调用的函数onResolved和失败时调用的函数onRejected


1.先指定回调函数，后改变状态，同时指定数据，改变状态的时候调用回调函数，调函数时异步执行的
此时指定了回调函数，但是没有执行回调函数，回调函数会先被保存起来

```js
const p1=new Promise((resolve,reject)=>{
    setTimeout(()=>{
    	resolve(1);//后改变状态，同时指定数据，改变状态的时候调用回调函数，回调函数时异步执行的
    },1000)
}).then( //先指定回调函数，保存回调函数
	value =>{},
	reason =>{}
)
```

2.先改变状态，同时指定数据，此时回调函数没有指定，所以需要先保存状态，后指定回调函数
```js
const p1=new Promise((resolve,reject)=>{
    	resolve(1);//先改变状态，同时指定数据，此时回调函数没有指定，所以需要先保存状态

}).then( //后指定回调函数，异步执行回调函数
	value =>{},
	reason =>{}
)
```

**总结**
1.先改变状态，同时指定数据，此时回调函数没有指定，需要先保存状态。
2.先指定回调函数，后改变状态和指定数据，此时不知道调用哪个回调，要将回调函数保存

### 关键问题4 promise.then()返回的新promise的结果状态由什么决定？

**由then()指定的回调函数执行的结果决定**
1.如果抛出异常，新promise变为rejected，reason为抛出的异常
2.如果返回的是非promise的任意值，新promise变为resolved，value为返回值。
3.如果返回的是另一个新promise，此promise的结果由新promise的结果决定。


```js
 new Promise((resolve,reject)=>{
	//resolve(1);
    reject(1)
}).then(
    value =>{
        console.log('onResolved1()'+value);
    },
    reason=>{
        console.log('onReject()1'+reason);//onReject() 1
    }
).then(
    value =>{
       console.log('onResolved2()'+value);//onResolved2() undefined
    },
    reason=>{
        console.log('onReject()2'+reason);
    }
)
```


### 5 promise如何串连多个操作任务
1.promise的then() 返回一个新的promise,可以使用then开始链式调用
2.通过then的链式调用串联多个同步/异步任务

异步需要包在Promise里面，因为Promise可以先指定回调函数，后改变状态

```js
 new Promise((resolve,reject)=>{
	setTimeout(() => {
        console.log("执行任务1(异步)");
        resolve(1);
    }, 1000);
}).then(
    value =>{
        console.log("任务1的结果",value);
        console.log("执行任务2(同步)");
        return 2;
    }
).then(
    value =>{
        console.log('任务2的结果()',value);
        setTimeout(() => {
           console.log('执行任务3(异步)');
            return 3;
        }, 1000);
    }
).then(
    //打印的时候异步3还没有执行完毕value=undefined; 
    value =>{
        console.log("任务3的结果",value);
    }
)
/*
执行任务1(异步)
time.html:20 任务1的结果 1
time.html:21 执行任务2(同步)
time.html:26 任务2的结果() 2
time.html:35 任务3的结果 undefined
time.html:28 执行任务3(异步)
*/

//异步任务3需要修改成
return new Promise((resolve,reject)=>{
    setTimeout(() => {
        console.log('执行任务3(异步)');
        resolve(3);
     }, 1000);}
)
```

### 6 promise异常穿透和中止
**异常穿透**
当使用promise的then链式调用时，可以在最后指定失败的回调
前面的任何操作**除了异常**，都会传到最后失败的回调中
**中断promise链**
当使用promise的then链式调用时，在中间中断，不再调用后面的回调函数
当使用promise的then链式调用时，可以在最后指定失败的回调，因为没有处理异常相当于 `reason => {throw reason}`，会一层一层往下寻找异常处理直到找到
当使用promise的then链式调用时，**若想中断promise链，可以return new Promise(()=>{})返回一个处于pending的promise。**


## Promise构造函数
- 参数是excutor执行器
- 返回一个promise

**思路**
1.执行器函数是同步执行的，也就是会立即执行。执行器函数接受两个参数resolve和reject函数。**这两个函数谁调用，是由使用者传入的executor执行器函数决定的。这两个函数的作用需要我们写代码实现。**
2.构造函数，我们需要确定构造函数中的属性。根据关键问题3和关键问题2可知，需要分别一个属性保存当前状态，存储状态改变时的数据，存储指定的回调函数且回调函数可能是多个。

> 1.先改变状态，同时指定数据，此时回调函数没有指定，需要先保存状态。
2.先指定回调函数，后改变状态和指定数据，此时不知道调用哪个回调，要将回调函数保存
3.当promise改变为对应状态时指定的对应状态的多个回调函数都会调用

3.resolve函数的作用  -- reject函数基本差不多
①如果当前promise不是pending不做处理直接返回，如果是resolve函数的作用是将pending改为resolved
②保存resolve函数指定的数据 
③如果此时有待执行的回调函数（说明是情况2）那么依次异步执行成功的回调。 -- 这里应该放在微队列里，自定义的时候采用的放在宏队列里

>回调函数存储的结构[{onResolved(){},onRejected(){}},{onResolved(){},onRejected(){}}]

4.根据关键问题1可知如果同步执行器抛出异常，此时的promise状态应该是失败的。可以捕获到异常后，使用reject函数改变状态。

```js
//使用
new Promise((resolve,reject)=>{
	resolve(1);
})

//自定义
const PENDING='pending';
const RESOLVED='resolved';
const REJECTED='rejected';
function Promise(executor) {
	 this.status = PENDING; //promise的状态；
     this.data = undefined;//用于存储结果数据
     this.callbacks=[];//[{onResolved(){},onRejected(){}},{onResolved(){},onRejected(){}}]
     const self = this;
	function resolve(value) {
			//作用①
		  	if(self.status!==PENDING)return;	
            self.status = RESOLVED;
			//resolve是通过resolve()调用的,所以这里的this指向window，但是我们需要执行promise实例
			//②
			self.data =  value;
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
```

## Promise.prototype.then/ Promise.prototype.catch
- 参数有两个，一个成功的回调函数onResolved和失败的回调函数onRejected
- 返回一个新的Promise对象，该Promise的状态由then的执行结果决定

**思路**
1.如果是先改变状态后指定回调，那么此时回调函数是可以直接调用的，该回调函数是异步执行。如果是先指定回调后改变状态，那么此时回调函数应该被存起来。
2.如何判断是以上的哪种情况？根据promise实例的status属性。如果是pending说明是先指定回调后改变状态，反之相反。
3. **promise.then()返回的新promise的结果状态由什么决定？**为什么返回的新promise需要知道状态？then支持链式调用，如果返回的新promise是pending状态，那么就不能链式调用了  状态改变的方法--关键问题1
> **由then()指定的回调函数执行的结果决定**
1.如果抛出异常，新promise变为rejected，reason为抛出的异常
2.如果返回的是非promise的任意值，新promise变为resolved，value为返回值。
3.如果返回的是另一个新promise，此promise的结果由新promise的结果决定。

4.需要接收回调函数的结果，try-catch捕获异常。结果可能是非promise的任意值或者新的promise，所以需要判断返回值的类型。如果是新的promise由新promise的结果决定，promise的结果由.then获取
5.所以不管是先改变状态还是先指定回调，当最后回调被触发时，都需要获取回调函数的结果，**因为需要根据回调函数的结果改变返回的promise的状态**
6.`.then` 可以不传失败的回调，那么需要将异常传递下去。如果成功的回调不是函数，将value值传递下去

```js
 Promise.prototype.then = function (onResolved,onRejected) {
         const self =this;
        //catch只会处理失败，所以成功的要继续向后传递成功
        onResolved =typeof onResolved==='function'?onResolved:value => value;
        //实现异常穿透
        onRejected =typeof onRejected==='function'?onRejected:reason =>{throw reason};

         //返回一个新的Promise对象
        return new Promise((resolve,reject)=>{
        	//根据回调函数执行的结果修改返回的promise的状态
            function handle(callback) {
                try {
                    const result = callback(self.data);//放在里面，放在外面这个会异步执行，返回获取不到，需要知道结果是什么
                    if(result instanceof Promise){//情况3
                    // result.then(
                     //    value => resolve(value), //如果这个执行说明返回的promise是成功的
                     //    reason=> reject(reason)//如果这个执行说明返回的promise是失败的
                     //    );//.then才知道promise是成功还是失败
                     result.then(resolve,reject);//简洁写法
                    }else {
                     resolve(result); //情况2 
                    }
                 } catch (error) {                  
                     reject(error);//情况1
                 }
            }

		  //如果先指定回调，需要将回调函数保存起来，回调函数执行完毕后还需要修改新promise对象的状态。这里没设置异步执行的原因是，回调的执行是在构造函数中，在构造函数中已经指定了是异步的了
             if(self.status===PENDING){
                self.callbacks.push({
                onResolved(value){
                    handle(onResolved);
                },onRejected(reason){
                    handle(onRejected);
                }
                });
             } 
             //如果先改变状态，后指定回调，状态已经改变了，这里需要指定异步调用
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
		

		}
}

//.catch
Promise.prototype.catch = function (onRejected) {
     return this.then(undefined,onRejected); //必须要retrun,要将.then返回的promise继续传递下去
}
```

## Promise.resolve()和Promise.reject()
- Promise.resolve()
	- 参数可以是一般值，也可以是promise对象，由参数的状态决定最后的状态
	- 返回的promise状态由参数状态决定
	> 如果参数一般值，promise成功，值为value
如果参数是成功的promise，返回的promise成功，值为value
如果参数是失败的promise，返回的promise失败,值为reason
- Promise.reject()
	- 参数为reason，不考虑promise对象的情况


```js
Promise.resolve = function (value) {
   return new Promise((resolve,reject)=>{
        if(value instanceof Promise){//返回的promise状态由参数的promise状态决定,使用.then获取到参数promise的状态
              value.then(resolve,reject);
        }else resolve(value);
     })
}

Promise.reject = function (reason) {
   return new Promise((resolve,reject)=>{
        reject(reason);
   })
}
```


## Promise.all()/Promise.race()的实现 ★ 面试常考
### Promise.all()
- 参数是数组
	- 数组中如果为值，说明该值为成功的value
- 返回一个promise，只要一个失败了立即返回失败的promise
	- 如果都成功时，值为一个成功值组成的数组
     - 如果有失败，值为第一个失败的promise值

**思路**
1. 返回一个promise，promise的结果由数组中的元素执行结果决定
2. 依次取出数组中元素的执行结果，注意如果元素是值是没有.then的，所以可以Promise.resolve(元素) 来让非promise值也有.then

>Promise.resolve(元素) 
> 如果参数一般值，promise成功，值为参数值
> 如果参数是成功的promise，返回的promise成功，值为value
> 如果参数是失败的promise，返回的promise失败，值为reason
> 所以不管对于promis还是值来说再套一层都没关系

4. 如果成功就按promise在数组中的顺序放进结果数组中，全部成功调用resolve(结果数组)。如果失败就执行reject，表示返回的promise对象失败了

```js
  Promise.all = function (promises) {
        let count = 0;//用来表示成功promise的数量
        const values = new Array(promises.length);//用来保存所有成功value的数组
        return new Promise((resolve,reject)=>{
          promises.forEach((p,index) => { //获取promises数组中每一个元素的结果
              Promise.resolve(p).then( //.then获取结果
                  value=>{
                    ++count;
                    values[index]=value;//需要按照promises数组的顺序放
                    if(count===promises.length){ //所有成功再执行resolve
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
```

### Promise.race()
- 参数是数组
	- 数组的元素可以为数值或promise
- 返回一个promise，结果由第一个完成的promise结果决定

```js
Promise.race = function (promises) {
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
```