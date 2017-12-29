#! /usr/bin/python
# _*_coding:utf-8_*_
# socket SERVER.py

import socket as s

serverobj = s.socket()
hostname = s.gethostname()
hostport = 13569

serverobj.bind((hostname, hostport))
serverobj.listen(5)

while True:
    c, addr = serverobj.accept()
    print("连接地址为： ",addr)
    c.send("send info")
    c.close()