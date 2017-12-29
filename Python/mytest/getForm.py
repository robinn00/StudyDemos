#! /usr/bin/python
# _*_ coding:utf-8 _*_

import cgi
form =  cgi.FieldStorage()
uname = form.getvalue("uname")
upws = form.getvalue("upws")

print("Content-type:text/html")
#print("Location: http://www.baidu.com")
print

print("""
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="" />
    <meta name="keywords" content="" />
  </head>
  <body>
""")
print("uname:"+uname+"<br>")
print("upws:"+upws+"<br>")
print("""
  </body>
</html>
""")