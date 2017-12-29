/**
 * Created by admin on 2016/9/12.
 */
var fs = require("fs");
var mk = require("markdown");
var filecontent;

filecontent = fs.readFileSync("coffeescript.md","utf-8");
filecontent = mk.parse(filecontent);
fs.writeFileSync("coffee.html",filecontent);
console.log("save successful...");
console.log("====================================");
console.log(filecontent);
