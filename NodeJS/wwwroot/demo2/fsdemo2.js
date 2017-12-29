/**
 * Created by admin on 2016/9/8.
 */

var fs = require("fs");
fs.unlink("t.txt",function (err) {
    if(err){
       return console.error(err);
    }

    console.log("delete successful.");
});



fs.mkdir("model/view",function (err) {
    if(err){
        console.log(err);
    }

    console.log("mk successful...");
});

