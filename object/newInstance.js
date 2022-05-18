/**
 *
 * @param {Function} Fn 
 * @param  {...any} arg 
 */
/*new的原理
1.立即创建一个新对象
2.对象的隐式原型指向构造函数的显式原型prototype
3.将函数中的this，设置成新建的对象，这样在构造器中用this引用新建的对象
4.执行构造函数的对象
5.构造函数有返回值且是对象？返回构造函数返回值:1创建的新对象
 */
function newInstance(Fn,...arg) {
    const obj = {};
    obj.__proto__ = Fn.prototype;
    let result = Fn.call(obj,...arg);
    return result instanceof Object ? result:obj;
}