#! /usr/bin/python
# _*_ coding:utf-8 _*_

import os
import Cookie
import cgitb
cgitb.enable()
print("Content-type:text/html")
print("Set-Cookie: name='postForm';expires=Wed, 28 Aug 2016 18:30:00 GMT")
print

print("""
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>postform</title>
    </head>
    <body>
        PostForm Testing...<br>
        <form name="testform" id="testform" action="/getForm.py" method="post" style="line-height:38px;"/>
        name:<input type="text" name="uname" value="" id="uname"/><br>
        upws:<input type="password" name="upws" value="" id="upws"/><br>
        <input type="submit" name="submit" value="submit"/>&nbsp;&nbsp;
        <input type="reset" name="reset" value="reset"/>
        </form>
        <hr>

        <br>
        <form enctype="multipart/form-data" name="fileform" id="fileform" method="post" action="getfile.py">
        <input type="file" name="ufile" id="ufile"/><br><br>
        <input type="submit" name="submit" value="upload"/>
        </form><br><br>
""")

if "HTTP_COOKIE" in os.environ:
    httpCookieString = os.environ['HTTP_COOKIE']
    print("<b>"+httpCookieString+"</b><br>")
    csc = Cookie.SimpleCookie()
    csc.load(httpCookieString)
    print(csc["name"].value)
print("""
    </body>
</html>
""")