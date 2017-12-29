#! /usr/bin/python
# _*_ coding:utf-8 _*_

from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from regform import app

http_server = HTTPServer(WSGIContainer(app))
http_server.listen(1235)
IOLoop.instance().start()