/**
 * Created by admin on 2016/9/9.
 */
var express = require("express");
var bodyParser = require("body-parser");
var app = express();



app.use(express.static("public"));

app.get("/",function (request,response) {
    response.sendFile(__dirname+"/getForm.html");
});

app.get("/getform",function (request,response) {
    response_json = {
        username: request.query.uname,
        userpws: request.query.upws
    };
    console.log(response_json_);
    var jsonstr_x = JSON.stringify(response_json_);
    response.send(jsonstr_x);
});



app.get("/postForm.html",function (req,res) {
    res.sendFile(__dirname+"/"+"postForm.html");
});

var urlencodedParser = bodyParser.urlencoded({extended:false});
app.post("/pform",urlencodedParser,function (request,response) {
    var username = request.body.uname;
    var userpws = request.body.upws;
    response.status(200);
    response.type("text/html");
    response.charset = "utf-8";
    //response.send( username+" == "+ userpws );


    response_json_ = {
        username_: username,
        userpws_: userpws
    };

    console.log(response_json_);
    var json_str_ = JSON.stringify(response_json_);
    response.end(json_str_);


});




var server_ = app.listen(9000,function () {
    console.log("http://localhost:9000");
})