/**
 * Created by admin on 2016/9/13.
 */
var express = require("express");
var app = express();
var path = require("path");
var router = require("./routes/form");
var router_index = require("");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static(__dirname+"/public"));
app.use("/form",router);
app.use("/",router_index);

var server = app.listen(4566,"127.0.0.1",function () {
    console.log("http://127.0.0.1:4566");
})
