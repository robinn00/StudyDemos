/**
 * Created by admin on 2016/9/11.
 */

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer = require("multer");
var fs = require("fs");
var cookieParser = require("cookie-parser");


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({dest:"/tmp"}).array("img"));
app.use(cookieParser());

app.get("/",function (request,response) {
    console.log(request.cookies);
    response.sendFile(__dirname+"/"+"uploadform.html");
});

app.post("/uploadform",function (request,response) {
    var file = request.files[0];
    var destpath = __dirname + "\\upload\\"+ file.originalname;
    var sourcepath = file.path;

    fs.readFile(sourcepath,function (err,data) {
        if(err){console.log(err);};
        fs.writeFile(destpath,data,function (err) {
            if(err){console.log(err);}else{
                response_json = {
                    info: "upload successful...",
                    filename: file.originalname
                };

                console.log(response_json);
                response.send(response_json);

            };
        });
    });
    console.log(destpath);
    console.log(sourcepath);
    console.log(file);

});

var server = app.listen(9000,function () {
    console.log("http://localhost:9000");
})