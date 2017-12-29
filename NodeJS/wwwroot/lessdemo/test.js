/**
 * Created by admin on 2016/9/27.
 */
var lessObj = require("less");
var paserobj = new(lessObj.Parser);


lessObj.render(".cls{width:(1+2)}",function (e,css) {
    console.log(css);
})


paserobj.parse(".table{height:(20+50)}",function (e,tree) {
    if(e){console.log(e);}
    console.log(tree.toCSS());
});
