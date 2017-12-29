/**
 * Created by admin on 2016/9/8.
 */
var express = require("express");
var app = express();
var bodyparser = require("body-parser");

app.use(express.static('public'));

app.get("/",function (request,response) {
    response.send("<h2>Express.....</h2>");
    response.end();
});

app.get('/abcd*',function (req,res) {
    var url = req.url;
    res.send(url);

});

app.get('/form',function (request,response) {
    console.log("route///form///");
    response.send("form....");
});

var urlencodedParser = bodyparser.urlencoded({extended:false});

app.post('/dox',urlencodedParser,function (request,response) {
    var username = request.body.username;
    var strs = request.hostname;
    //response.writeHead(200,{"content-type":"text/html;charset=utf-8"});
    response.status(200);
    response.type("text/html");
    response.charset = "utf-8";
    console.log("dox...");
    response.write("post..dox.....|| "+username+"=="+strs);
    response.end();

});

var server = app.listen(9000,function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("http://%s:%s",host,port);
});