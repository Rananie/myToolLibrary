/*
1.先转换成数组 split
2.将数组翻转
3.转化回字符串 join
*/
function reverseString(str) {
    let arr = str.split('');
    //let arr = [...str]
    arr.reverse();
    return arr.join('');
}

/*
使用双指针，一个从头开始，一个从尾开始，遇见不一样的就返回false
可以先将字符串翻转，判断反转后是否等于翻转前
*/
function palindrome(str) {
    return reverseString(str) === str;
}

