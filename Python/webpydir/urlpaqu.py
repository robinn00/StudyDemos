#! /usr/bin/python
# _*_ coding:utf-8 _*_

import urllib

strobj = urllib.urlopen("http://www.baidu.com")
srinfo  = strobj.read()
print(srinfo)