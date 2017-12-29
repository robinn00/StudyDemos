#! /usr/bin/python
# _*_ coding:utf-8 _*_

from twisted.web.resource import Resource
from twisted.web import server
from twisted.web import static
from twisted.internet import reactor

PORT = 2356

class ReStructed(Resource):

    def __init__(self, filename, *a):
        self.rst = open(filename).read()

    def render(self, request):
        return self.rst

resource = static.File('/')
resource.processors = {'.py':ReStructed}
resource.indexNames = ['regform.py']

reactor.listenTCP(PORT, server.Site(resource))
reactor.run()