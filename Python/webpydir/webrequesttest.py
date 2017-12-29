#! /usr/bin/python
# _*_ coding:utf-8 _*_

import sys
import requests
url_x = "http://www.163.com"
rxs = requests.get(url_x)

print(dir(requests))

sys.stdout.write(str(rxs))
print(rxs.text)