/**
 * Created by admin on 2016/9/13.
 */
var express = require("express");
var router = express.Router();
router.get("/",function (request,respnse,next) {
    respnse.render("form",{names:"EJS DEMO"});
});
module.exports = router;