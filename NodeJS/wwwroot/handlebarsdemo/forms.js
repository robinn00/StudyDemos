/**
 * Created by admin on 2016/9/13.
 */
var express = require("express");
var app = express();
var path = require("path");
var hbs = require("hbs");
var forms_ = require("./routes/forms");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","hbs");

app.use(express.static(path.join(__dirname,"public")));
app.use("/form",forms_);

var server = app.listen(4545,"127.0.0.1",function () {
    console.log("http://127.0.0.1:4545/");
})