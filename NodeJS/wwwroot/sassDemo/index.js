var express = require("express");
var app = express();
var path = require("path");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","jade");
app.use(express.static(path.join(__dirname,"public")));
app.get("/form",function (request,response) {
    response.render("form");
});
var server = app.listen(3556,function () {
    console.log("http://localhost:3556");
})
