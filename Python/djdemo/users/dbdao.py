#! /usr/bin/python
# _*_ coding:utf-8 _*_
from models import uinfo

def dbSave():
    try:
        dbs = uinfo(u_name='robinn',u_sex='male',u_addr='addrinfo',u_age=78)
        dbs.save()
    except:
        return False
    finally:
        return True

def getAll():
    list = uinfo.objects.all()
    return list

def delInfo(num):
    try:
        lines = uinfo.objects.filter(id=num)
        lines.delete()
    except:
        return False
    finally:
        return True

def updateUinfox(oldname, newname):
    try:
        linesx = uinfo.objects.filter(u_name=oldname)
        linesx.update(u_name=newname)
    except:
        return False
    finally:
        return True