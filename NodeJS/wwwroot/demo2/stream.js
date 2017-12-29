/**
 * Created by admin on 2016/9/7.
 */
var fs = require("fs");
var data = "";

var fsrs = fs.createReadStream("x.txt");
fsrs.setEncoding("utf-8");
fsrs.on("data",function (str) {
    data += str;
})

fsrs.on("error",function (erro) {
    console.log(erro);
})

fsrs.on("end",function () {
    console.log(data);
})

console.log("coding....end..");




var fs2 = require("fs");
var datax = "http://www.baidu.com";
var ws = fs2.createWriteStream("out.txt");
ws.write(datax,"utf-8");
ws.end();


ws.on("finish",function () {
    console.log("finish....");
})

ws.on("error",function (err) {
    console.log(err);
})

console.log("writeable....");