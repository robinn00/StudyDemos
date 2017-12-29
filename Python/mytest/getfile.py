#! /usr/bin/python
# _*_ coding:utf-8 _*_

import os
import cgi
import cgitb
cgitb.enable()

print("Content-type:text/html")
print

form = cgi.FieldStorage()
ufileContent = form.getvalue("ufile")
ufileS = form["ufile"]
fc = ufileS.file.read()
if ufileS.filename:
    sPath = os.path.basename(ufileS.filename)
    fso = open('tmp/'+sPath,'wb')
    fso.write(fc)
    fso.close()
    print("upload successful!...")