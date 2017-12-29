/**
 * Created by admin on 2016/9/7.
 */

var events = require("events");
var eventemit = new events.EventEmitter();

var connected = function () {
    console.log("connected().....");
    eventemit.emit("check");
}

var checked = function () {
   console.log("checked....");
}

eventemit.on("check",checked);
eventemit.on("conn",connected);
eventemit.emit("conn");
console.log("ending...");



var lines = function (num1,num2) {
    console.log("====");
}


eventemit.on("lines",function (n1,n2) {
    console.log(n1+n2);
    console.log("n1+n2....");
});
eventemit.emit("lines",23,90);

console.log("======================分割线==================");


console.log("======================分割线==================");

