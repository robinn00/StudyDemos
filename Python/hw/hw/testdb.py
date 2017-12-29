#! /usr/bin/python
# _*_ coding:utf-8 _*_


from django.http import HttpResponse
from TestModel.models import Test

def testdb(request):
    test1 = Test(uname="robinn",usex="male",uemail="dox@163.com",uage=12)
    test1.save()
    return HttpResponse("add data success!")