#! /usr/bin/python
# _*_ coding:utf-8 _*_


from django.http import HttpResponse
from TestModel.models import Test

def updateInfo(request):

    list = Test.objects.get(uage=74)
    list.uname = "xxxx"
    list.save()
    return HttpResponse("update successfull");
