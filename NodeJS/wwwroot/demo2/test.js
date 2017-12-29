/**
 * Created by admin on 2016/9/11.
 */
var express = require("express");
var app = express();
var admin = express();

admin.on('mount', function (parent) {
    console.log('Admin Mounted');
    console.log(parent); // refers to the parent app
});

admin.get('/', function (req, res) {
    res.send('Admin Homepage');
});

app.use('/admin', admin);