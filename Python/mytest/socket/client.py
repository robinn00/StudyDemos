#! /usr/bin/python
# _*_ coding:utf-8 _*_
# socket client.py

import socket as s

sx = s.socket()
hostname = s.gethostname()
hostport = 13569

sx.connect((hostname, hostport))
print(sx.recv(2048))
sx.close()