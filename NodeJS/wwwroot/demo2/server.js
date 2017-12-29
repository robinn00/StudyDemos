/**
 * Created by admin on 2016/9/7.
 */
var http = require("http");
var url = require("url");
var querystring = require('querystring');

function start(router) {
    function loadserver(request,response) {
        var urlobj = url.parse(request.url);
        var pathname  = urlobj.pathname;
        console.log("requesturl: "+request.url);
        console.log("pathname: "+pathname);
        console.log("querystring:  "+urlobj.query);
        var strobj = querystring.parse(urlobj.query);
        console.log(strobj.id);
        console.log(strobj.name);

        router(pathname);
        response.writeHead(200,{"content-type":"text/plan"});
        response.write("DOX...");
        response.end();
    }

    http.createServer(loadserver).listen(4555);
    console.log("http://localhost:4555");
}

exports.start = start;