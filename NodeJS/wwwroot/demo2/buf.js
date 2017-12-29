/**
 * Created by admin on 2016/9/7.
 */

var buf = new Buffer("http://www.baidu.com","utf-8");
console.log(buf.toString());

var buf1 = new Buffer(10);
for(var i=0;i<buf1.length;i++){
    buf1[i] = i+20;
    console.log(buf1[i]+"\n");
}
console.log(buf1.length);


var buf2 = new Buffer([11,22,33,44,55,66]);
for(var j=0;j<buf2.length;j++){
    console.log(buf2[j]+"\n");
}



var buf_ = new Buffer(256);
var len = buf_.write("http://www.163.com");
console.log(len);
console.log(buf_.toString("utf-8",0,18));


var json = buf_.toJSON(buf_);
console.log(json);

var buf_1 = new Buffer("baidu");
var buf_2 = new Buffer("sina");

var buf_3 = Buffer.concat([buf_1,buf_2]);
console.log(buf_3.toString());


var bf_1 = new Buffer("abc");
var bf_2 = new Buffer("abcde");

var result = bf_1.compare(bf_2);

if(result<0){
    console.log(-1);
}else if(result == 0){
    console.log(0);
}else if(result>0){
    console.log(1);
}

console.log(result);


var bb1 = new Buffer("ABCD");
var bb2 = new Buffer(4);
bb1.copy(bb2);
console.log(bb2.toString());

var bb3 = bb1.slice(0,3);
console.log(bb3.toString());
console.log(bb3.length);