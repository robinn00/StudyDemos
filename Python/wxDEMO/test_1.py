#!/usr/bin/python

import requests

url = "http://zhtbt.xyz/skip/demox.php"
#url = "http://wx.x3u.cn/ws7.php"
#url = "https://plogin.m.jd.com/cgi-bin/m/wxlogin"
content = requests.get(url).content
print content