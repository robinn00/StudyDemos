/**
 * Created by admin on 2016/9/7.
 */
var http = require("http");
http.createServer(function (request,response) {
    response.writeHead(200,{'content-type':'text/plan'});
    response.end("EXPRESS ....");
}).listen(6666);
console.log("http://localhost:6666");