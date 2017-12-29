/**
 * Created by admin on 2016/9/8.
 */

var fs = require("fs");
var util = require("util");

fs.readdir("model/view",function (err,files) {
    if(err){return console.error(err);};
    files.forEach(function (file) {
        console.log("File/DIR:  "+file);
        fs.stat("model/view/"+file,function (err,stat_) {
            var arry = file.split('.');
            if(arry.length>1){
                console.log("FILE");
                fs.unlinkSync("model/view/"+file,function (err_file) {
                    if(err_file){return console.error(err_file)};
                    console.log("del_file_success...");
                });
            }else{
                console.log("DIR");
                fs.rmdirSync("model/view/"+file,function (err_dir) {
                    if(err_dir){return console.log(err_dir)};
                    console.log("remove_DIR_success....");
                });
            }
            console.log(file);
        });
        console.log("===================================");
    });

    /*
    fs.rmdir("model/view",function (err) {
        if(err){console.log(err)};
        console.log("remove view successful..");
    });
    */
});







/*
 fs.readdir("model",function (errors,files) {
 if(errors){return console.error(errors)};
 files.forEach(function (file) {
 console.log("file/dir:  "+file);
 });
 });


fs.rmdir("model/view",function (err) {
    if(err){console.log(err);};
    console.log("remove ....");
});
*/