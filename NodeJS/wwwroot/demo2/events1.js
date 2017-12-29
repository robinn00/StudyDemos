/**
 * Created by admin on 2016/9/7.
 */

var events = require("events");
var evemits = new events.EventEmitter();

var conn1 = function connx_() {
    console.log("connx_....");
}

var conn2 = function conny_() {
    console.log("conny_...............");
}

evemits.addListener("conn",conn1);
evemits.on("conn",conn2);

var ecnt = events.EventEmitter.listenerCount(evemits,"conn");
console.log("监听器："+ecnt);

evemits.emit("conn");

evemits.removeListener("conn",conn2);

var ecnt2 = events.EventEmitter.listenerCount(evemits,"conn");
console.log("监听器:"+ecnt2);

evemits.emit("conn");

console.log("END....");





