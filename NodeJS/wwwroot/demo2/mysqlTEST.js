/**
 * Created by admin on 2016/9/11.
 */

var mysql = require("mysql");
var TEST_DB = "users";
var TEST_TAB = "users_uinfo";


var client = mysql.createConnection({
    user:'root',
    password:'root'
});

var sql_ = "select * from "+TEST_TAB;
client.connect();
client.query("use "+TEST_DB);
client.query(sql_,function (err,results,fields) {
    if(err){console.log(err)};
    console.log("id u_name  u_sex   u_addr  u_age");
    console.log("==================================");
    for (var j=0;j<results.length;j++){
        console.log(results[j].id+" "+results[j].u_name+"   "+results[j].u_sex+"    "+results[j].u_addr+"    "+results[j].u_age);
    }
    console.log("==================================");
});