/**
 * Created by admin on 2016/9/7.
 */

var https_ = require("./server");
var router = require("./router");
https_.start(router.route);