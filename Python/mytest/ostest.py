#! /usr/bin/python
# _*_ coding:utf-8 _*_
# ostest.py

import os

print("Content-type:text/html")
print

print("<!DOCTYPE html>")
print("<html lang=\"en\">")
print("<head>")
print("    <meta charset=\"UTF-8\">")
print("    <title>os evn</title>")
print("</head>")
print("<body>")
for key in os.environ.keys():
    print("<span style='color:blue:font-size:10pt;font-weigth:bold;'>:"+key+":&nbsp;&nbsp;</span> <span style='font-size:9pt;color:red;'>"+os.environ[key]+"</span><br>")

print("</body>")
print("</html>")