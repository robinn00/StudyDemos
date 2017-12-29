/**
 * Created by admin on 2016/9/7.
 */


var fs = require("fs");
var input = fs.createReadStream("out.txt");
var output = fs.createWriteStream("output.txt");
input.pipe(output);

console.log("finished.....");



var fs1 = require("fs");
var zip = require("zlib");

var input_1 = fs.createReadStream("out.txt");
var gzip = zip.createGzip();
var output_1 = fs.createWriteStream("out.txt.gz");
input_1.pipe(gzip).pipe(output_1);

console.log("gzip...finished.....");


var fs2 = require("fs");
var zip2 = require("zlib");

var input_2 = fs.createReadStream("out.txt.gz");
var gunzip = zip2.createGunzip();
var output_2 = fs.createWriteStream("output.txt");

input_2.pipe(gunzip).pipe(output_2);

console.log("Gunzip...finished....");
