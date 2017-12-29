#! /usr/bin/python
# _*_ coding:utf-8 _*_

from django.shortcuts import render,render_to_response
from django.core.context_processors import csrf

def showpostForm(request):
    return render_to_response("postForm.html")

def postSubmit(request):
    ctx = {}
    ctx.update(csrf(request))
    if request.POST:
        ctx['rlt'] = request.POST['kw']
    return render(request,'postForm.html',ctx)