/**
 * Created by admin on 2016/9/7.
 */

var fs = require("fs");
var data = fs.readFileSync("x.txt");
console.log(data.toString());
console.log("end.....");



var fs1 = fs;

fs1.readFile("x.txt",function (err,data) {
    if (err){
        console.log(err.toString());
    }

    console.log(data.toString());
});

console.log("FS1.end....");
