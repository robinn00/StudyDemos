/**
 * Created by admin on 2016/9/13.
 */
var express = require("express");
var router = express.Router();
router.get("/",function (request,response,next) {
    var users = ["one_s","two_s","thr_s"];
    var form_ = "doxdox";
    response.render("form",{users:users,forms:form_});
});
module.exports = router;