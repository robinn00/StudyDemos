#! /usr/bin/python
# _*_ coding:utf-8 _*_

from django.http import HttpResponse
from django.shortcuts import render_to_response

def showgetForm(request):
    return render_to_response("getform.html")

def getSubmit(request):
    msg = ""
    request.encoding = 'utf-8'
    if 'uname' in request.GET and 'uage' in request.GET:
        msg = 'UserName:'+request.GET['uname']+"<br>"+\
                'UserAge:' +request.GET['uage']
    else:
        msg = "error UserName or UserAge"
    return HttpResponse(msg)
