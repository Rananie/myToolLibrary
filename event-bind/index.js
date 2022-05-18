/* 
语法：addEventListener(element, type, fn, selector)
说明：如果selector没有，直接给element绑定事件，
  如果selector有，将selector对应的多个元素的事件委托绑定给父元素element
*/

function addEventListener1(element, type, fn, selector) {
    //判断el的类型,获取到el元素
    if(typeof element === 'string')element=document.querySelector(element);
  
    // 如果没有指定selector, 普通的事件绑定
    if (!selector) {
      element.addEventListener(type, fn)
    } else {// 否则是代委托的事件绑定，点击之后先判断是不是需要触发的子元素
      element.addEventListener(type, function (event) {
        // 得到真正发生事件的目标元素
        const target = event.target
        // 如果与选择器匹配则触发，不是则不触发
        console.log(target);
        if (target.matches(selector)) {
          // 调用处理事件的回调fn, 并指定this为目标元素, 参数为event
          fn.call(target, event)
        }
      })
    }
  }

  const eventBus = {
    //保存类型与回调的容器
    callback:{}
  };
  //绑定事件
  eventBus.on = function (type,callback) {
    if(this.callback[type]){
      this.callback[type].push(callback);
    }else{
      this.callback[type] = [callback];
    }
  }
  //触发事件
  eventBus.emit = function (type,data) {
    if(this.callback[type] && this.callback[type].length>0){
      this.callback[type].forEach(callback => {
        callback(data);
      });
    }
  }
  //解绑事件
  eventBus.off = function (eventName) {
    if(eventName){
      //清楚对应事件名
      delete this.callback[eventName];
    }else{//全部清除
      this.callback = {};
    }
  }