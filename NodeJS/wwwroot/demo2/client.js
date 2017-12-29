/**
 * Created by admin on 2016/9/8.
 */

var httpobj = require("http");

var options = {
    host:'127.0.0.1',
    port:'7777',
    path:'/default.html'
};
var callbacks = function (response) {
    var body = "";
    response.on("data",function (data) {
        body += data;
    });

    response.on("end",function () {
        console.log("loding...end..."+body);
    })

}
var req = httpobj.request(options,callbacks);
req.end();