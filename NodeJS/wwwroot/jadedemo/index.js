/**
 * Created by admin on 2016/9/11.
 */
var express = require("express");
var app = express();
var jade = require("jade");
var path = require("path");

app.set("view engine","jade");
app.set("views",__dirname+"/"+"views");
app.use(express.static(path.join(__dirname,"public")));

function users(name_,sex_,age_) {
    this.name = name_;
    this.sex = sex_;
    this.age = age_;
}
var usersobj = [
    new users("rob","male","45"),
    new users("yangyang","male","78"),
    new users("jianglei","female","12")
];
app.get("/",function (request,response) {
    response.render("default",{lists:usersobj});
});

app.get("/jade1",function (request,response) {
    response.render("views",{users:usersobj});
});

app.use(function (err,request,response,next) {
    response.send(err.stack);
})
var server = app.listen(9000,function () {
    console.log("http://localhost:9000");
})