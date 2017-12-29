/**
 * Created by admin on 2016/9/7.
 */
var person = require("./mod1");
var p = new person();
//p.setName("robinn");
p.setName("YANGYANG");
console.log(p.getName());

function say(word) {
    console.log("SAY："+word);
}

function exe_(fn,word) {
    fn(word);
}

exe_(say,"who");

exe_(function (str) {
    console.log("str:"+str);
},"dodo");



