/**
 * Created by admin on 2016/9/13.
 */
var express = require("express");
var router = express.Router();
var users={"name":"robinn","sex":"male","age":"45"};
var arrays = ["one","two","thr"];
router.get("/",function (request,response,next) {
    response.render("index_users",{users:users,arrays_:arrays,sexs:"femalssssasdkflsad"});
});
module.exports = router;