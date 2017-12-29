#! /usr/bin/python
# _*_ coding:utf-8 _*_

import web
urls = ('/', 'index')
app = web.application(urls, globals())
class index:
    def GET(self):
        print("installing.....d ox .....")
        #return "web.py installing.......<br><hr><div style='border:1px solid red;width:400px;height:200px;'>testing..</div>"
app.run()