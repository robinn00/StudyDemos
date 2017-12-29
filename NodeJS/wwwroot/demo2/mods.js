/**
 * Created by admin on 2016/9/7.
 */
exports.Checks = function () {
    var str = "http://www.baidu.com0";
    var fn1 = function (num) {
        console.log("NUM1: "+num);
    }

    var fn2 = function (num2) {
        console.log("NUM2: "+num2);
    }
    console.log("checking.....");
    
    this.setFn = function () {
        return fn2;
    }
};


/*
function loads() {
    console.log("loads....");
}

module.exports = loads;
*/



