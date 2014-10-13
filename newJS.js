var patt = new RegExp('.ljpg|.png');//要查找的字符串为'Adam'
var str = 'Mynameis.jpgAdam.pngLi.';

if(patt.test(str)){//字符串存在返回true否则返回false
 console.log('字符串中有Adam');
}else{
 console.log('字符串中没有Adam');
}