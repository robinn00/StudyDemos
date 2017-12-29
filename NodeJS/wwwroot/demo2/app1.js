/**
 * Created by admin on 2016/9/8.
 */
var express = require("express");
var app = express();
app.get('/',function (request,response) {
    response.send("<h1 style='color:red;'>Express Jade...</h1>");
});

app.listen(8989,function () {
    console.log("listening...")
});