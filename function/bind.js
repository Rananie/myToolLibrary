/*
1.返回一个新函数
2.新函数调用，实现call的作用
*/
export function bind(Fn,obj,...args) {
    //返回新函数 args2调用返回函数时的传参
    return (...args2) => {
    //调用原来函数，这里的this表示调用bind时候的函数对象，参数列表由args和atgs2依次组成
      return call(Fn,obj,...args,...args2)
    }
}
