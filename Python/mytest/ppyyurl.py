#! /usr/bin/python
# _*_ coding:utf-8 _*_


"""
import urllib2
rxxx = urllib2.urlopen("http://www.baidu.com")

print(rxxx.read())
"""


import requests

print(requests.get("http://www.baidu.com").text())






