def application(environ,start_response):
    start_response("200 OK",[('content-type',"text/html")])
    return ['<html><body><span style=color:red;>Hello world!</span></body></html>']