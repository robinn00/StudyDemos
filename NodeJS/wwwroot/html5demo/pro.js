/**
 * Created by admin on 2016/9/22.
 */
var i = 0;
var loadnum = function () {
    i += 1;
    postMessage("pro____"+i);
    setTimeout("loadnum()",2000);
}
loadnum();

onmessage = function (evt) {
    console.log(evt.data);
};