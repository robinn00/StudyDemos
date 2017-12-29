from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse
from models import uinfo
from dbdao import dbSave
from dbdao import getAll
from dbdao import delInfo
from dbdao import updateUinfox
from myform import addForms

# Create your views here.
def showIndex(request):
    dict_list = {}
    dict_list['info'] = 'index render successful...'
    return render_to_response("show.html",context=dict_list)

def showSuccess(request):
    return HttpResponse("Successful...")

def showRender(request):
    list = {}
    list['rs'] = uinfo.objects.all()
    return render(request,'show.html',context=list)

def savedbinfo(request):
    list = {}
    msg = ""
    if dbSave():
        msg = "sucessful"
    else:
        msg = "fail"
    list['saveinfo'] = msg
    return render(request,"show.html",context=list)


def getAllinfo(request):
    dbinfos = {}
    list = getAll()
    if list:
        dbinfos['infox'] = list
    else:
        dbinfos['infox'] = None
    return render(request,'show.html',context=dbinfos)


def deleteInfo(request):
    list={}
    msg = "fail"
    if delInfo(2):
        msg = "delete successful"
    list['msgx'] = msg
    return render(request,'show.html',context=list)

def updateInfo(request):
    msg = 'fail'
    flag = updateUinfox('doxdoxdox','hello')
    if flag:
        msg = "database update successful..." + str(flag)
    else:
        msg = "failing...."
    request.msginfo = msg
    return render(request,"show.html")

def addnum_1(request):
    a = request.GET['a']
    b = request.GET['b']
    c = int(a) + int(b)
    return HttpResponse(str(c))

def addnum_2(request,a,b):
    total = int(a) + int(b)
    return HttpResponse(str(total))

def indexform(request):

    if request.method == 'POST':
        form = addForms(request.POST)
        if form.is_valid():
            pass
            a1 = form.cleaned_data['a']
            b1 = form.cleaned_data['b']
            return HttpResponse(str(int(a1) + int(b1)))
    else:
        form = addForms()
    return render(request, 'indexform.html', {'form': form})