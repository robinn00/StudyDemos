/**
 * Created by admin on 2016/9/13.
 */
var express = require("express");
var app = express();
var path = require("path");
var index_users_ = require("./routes/index_users");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"public")));
app.use("/indexuser",index_users_);

app.listen(4554,function () {
    console.log("http://localhost:4554");
})
