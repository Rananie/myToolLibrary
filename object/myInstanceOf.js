/*
判断obj是否是Type类型的实例
*/
function myInstanceOf(obj,Type) {
    let protoObj = obj.__proto__;
    while(protoObj){
        if(protoObj === Type.prototype)return true;
        protoObj = protoObj.__proto__;
    }
    return false;
}