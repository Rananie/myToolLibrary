function axios({
    url,
    method="GET", //设置默认值
    parmas={},//默认空对象
    data={}//设置默认值
  }) {
    //返回一个Promise对象
    return new Promise((resolve, reject) =>  {
        //处理query参数，拼接到url
        let queryString='';
        Obeject.keys(params).forEach(key=>{
			queryString+=`${key}=${parmas[key]}&`
		})
        if (queryString){
            //去掉最后的&
           queryString = queryString.substring(0,queryString.length-1)
           //拼接
           url += "?"+queryString
        }
        //处理method为大写，传进来的可能是小写
        method = method.toUpperCase()
    //1.执行异步ajax请求
        //创建xhr对象
        const request = new XMLHttpRequest();
        //初始化请求(异步)
        request.open(method,url,true)
        //绑定状态改变的监听,send是异步的，所以绑定监听写在send后面也可以
        request.onreadystatechange = function () {
            //如果请求没有完成，不需要做处理
            if (request.readyState!==4){
                return
            }
             //请求完成了可以获取状态码了
             //如果响应状态码在[200，300)之间代表成功，否则失败
    		 const {status,statusText} = request;
    		      if (status>=200&&status<=299){
        		 //2.1如果请求成功了，调用resolve()
         		 //准备结果response对象
         				const response = {
             				//服务器返回的是JSON数据需要转换成对象
             				//响应json数据自动解析为js的对象/数组
             				data:JSON.parse(request.response),
             				status,
             				statusText,
        	 			}
            			resolve(response)
    	 }else {
         	//2.2如果请求失败,调用reject()
         	reject(new Error(`request error status is ${status}`))
    	 }
        }
        switch (method){
            case "GET"||"DELETE" :
                //get的参数通过url传
                request.send();
                break;
            case "POST"||"PUT":
                //发送JSON请求体的数据
                request.setRequestHeader("Content-Type","application/json;charset=utf");
                request.send(JSON.stringify(data));
                break;
        }
    })
}

/* 发送特定请求的静态方法 */
axios.get = function (url, options) {
    return axios(Object.assign(options, {url, method: 'GET'}))
  }
  axios.delete = function (url, options) {
    return axios(Object.assign(options, {url, method: 'DELETE'}))
  }
  axios.post = function (url, data, options) {
    return axios(Object.assign(options, {url, data, method: 'POST'}))
  }
  axios.put = function (url, data, options) {
    return axios(Object.assign(options, {url, data, method: 'PUT'}))
}


export default axios;