/**
 * Created by admin on 2016/9/7.
 */

var fs = require("fs");
var buf = new Buffer(1024);

fs.readFile("out.txt",function (err,data) {
    if(err){
        return console.error(err);
    }
    console.log("reading...");
    console.log(data.toString());
});

console.log("finished");



var rf = fs.readFileSync("x.txt");
console.log(rf.toString());



fs.open("x.txt","r+",function (err,fd) {
    if(err){
        return console.error(err);
    };

    fs.read(fd,buf,0,buf.length,0,function (err,bytes_) {
        if (err){ return console.error(err);};
        console.log("Bytes: "+bytes_);
        if(bytes_>0){
            console.log(buf.slice(0,bytes_).toString());
        }

        fs.close(fd,function (err) {
            if (err){return console.error(err)};
            console.log("close successful...");
        });
    });
    //console.log("====="+fd.toString()+"=====");
});

fs.stat("x.txt",function (err,sta) {
    if(err){
        return console.error(err);
    }

    console.log(sta);
    console.log("isfile:%s",sta.isFile());
    console.log("isdir:%s",sta.isDirectory());
    console.log(sta.size);
});

var data="<script type='text/javascript'>window.alert('test...');</script>";
fs.writeFileSync("t.txt",data);
console.log("successful..");

fs.writeFile("t1.txt",data,function (err) {
    if(err){
        return console.error(err);
    }

    console.log("成功。。。");
    fs.readFile("t1.txt",function (err,data) {
        console.log(data.toString());
    });

});