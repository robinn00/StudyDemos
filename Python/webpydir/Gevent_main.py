#! /usr/bin/python
# _*_ coding:utf-8 _*_

from gevent.wsgi import WSGIServer
from regform import app

http_server = WSGIServer(('127.0.0.1', 5325), app)
http_server.serve_forever()