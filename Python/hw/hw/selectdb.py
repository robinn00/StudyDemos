#! /usr/bin/python
# _*_ coding:utf-8 _*_

from django.http import HttpResponse
from TestModel.models import Test

def selectAllinfo(request):
    resp = ""
    list = Test.objects.all()
    list = Test.objects.filter(uage=12)
    #Test.objects.order_by("uage")
    for val in list:
        resp += str(val.id)+" == "+val.uname+" == "+val.usex+" == "+val.uemail+"=="+str(val.uage)+"<br><br>"
    return HttpResponse(resp)



