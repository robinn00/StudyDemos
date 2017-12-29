/**
 * Created by admin on 2016/9/8.
 */

var http = require("http");
var url = require("url");
var fs = require("fs");

http.createServer(function (request,response) {
    var pathname = url.parse(request.url).pathname;
    console.log("url: "+pathname);
    fs.readFile(pathname.substr(1),function (err,data) {
        if(err){
            console.log(err);
            response.writeHead(404,{"content-type":"text/html"});
            response.write(err.toString());
        }else{
            response.writeHead(200,{"content-type":"text/html"});
            response.write(data.toString());
        }
        response.end();
    });

}).listen(5666);
console.log("http://localhost:5666");