/**
 * Created by admin on 2016/9/7.
 */
var util = require("util");

console.log("__filename: "+__filename);
console.log("__dirname: "+__dirname);
console.info("info....");

var t = setTimeout(function () {
    console.log("settimeout....2000");
},2000);

clearTimeout(t);

console.log(process.cwd());
console.log(process.version);
console.log(process.memoryUsage());

console.log("dox%sdox",454);

console.time("cnt");
var num = 0;

var t2 = setInterval(function () {
    console.log("setinterval...4000");
    num += 1;
    if (num == 1){
        clearInterval(t2);
        console.log("5555");
    }
},4000);

console.timeEnd("cnt");


function Persons() {
    this.name = "";
    this.sex = "";

    this.setName = function (name_) {
        this.name = name_;
    }
    
    this.setSex = function (sex_) {
        this.sex = sex_;
    }
    
    this.getName = function () {
        return this.name;
    }

    this.getSex = function () {
        return this.sex;
    }

}

var p = new Persons();
p.setSex("male。。。。。");
console.log(p.getSex());
util.inspect(p);

