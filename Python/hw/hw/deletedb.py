#! /usr/bin/python
# _*_ coding:utf-8 _*_


from django.http import HttpResponse
from TestModel.models import Test

def delinfo(request):
    list = Test.objects.filter(uage=12)
    list.delete()
    return HttpResponse("delete successfull");
