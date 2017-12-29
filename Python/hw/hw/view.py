#! /usr/bin/python
# _*_ coding:utf-8 _*_

from django.http import HttpResponse
from django.shortcuts import render

def hl(request):
    cnt = {}
    cnt["dox"] = "Django view"
    cnt["uname"] = "Dj admin"
    cnt["usex"] = "female"
    cnt["upws"] = "5845ssfd"
    cnt['username']='Dj admin'
    cnt['list'] = ['xml1','xhtml','shtml','html']
    return render(request,"test.html",cnt)