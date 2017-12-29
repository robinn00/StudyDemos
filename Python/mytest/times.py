#! /usr/bin/python
# _*_ coding:utf-8 -*_

import time
import calendar
import test3 as t
import var


def main():
    time1 = time.time()
    print(time1)
    time2 = time.localtime(time.time())

    print("==================================")
    for x1 in time2:
        print(x1)
    print("==================================")

    print(time2)

    print(time2.tm_year)
    print(time2.tm_mon)
    print(time2.tm_hour)

    print(time.asctime(time2))
    print("##############")
    print(time.localtime())
    print("##############")

    var_times = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    print(var_times)

    print("\n######################################################")
    cal = calendar.month(2026, 6)
    print(cal)
    print("######################################################\n")

    if 0:
        print("0")
    elif False:
        print("FALSE")
    elif True:
        print("True")
    else:
        print("else")
    pass

    if (1 == 1): print("1==1")
    if (1 != 1): print("1<>1")


def mainx():
    num = 0
    while (num < 5):
        num += 1
        print(num)
    else:
        print("over")

    while 1 <> 1:
        print("1==1")
    else:
        print("1<>1")

    print("###########################################")
    num += 2
    while (num > 6): print("num>6");break;
    print("###########################################")

    pass

    for n1 in "robinn":
        print(n1)

    print("================================")
    array = ["one", 'two', 'four']
    for x1 in range(len(array)):
        print(array[x1])
    else:
        print("for over")


def fun1(x, y):
    return x + y

def fun2(x,y,z):
    return x*y+z

def fun3(x,y=3):
    # return x*y+1
    return

mon = 4500
def var_():
    global mon
    mon = mon+200
    print(mon)


if __name__ == "__main__":
    # main()
    # mainx()
    print(fun1(10, 32))
    print(fun2(z=10,x=2,y=30))
    print(fun3(2,9))

    sum = lambda x1,x2:x1+x2
    print(sum(2,4))

    print(mon)
    var_()
    print(mon)

    t.main3()
    var.sum(30,20)

    print("#################################")
    print(__file__)
    print(__name__)
    print(__debug__)
    print(__doc__)
    print("#################################")

    vt = dir(t)
    for xy in vt:
        print(xy)

    for x in vt:print(x)

    vxy = locals()
    glo = globals()

    print(vxy)
    print(vxy.keys())
    print(vxy.get("mainx"))

    print(glo)
    print(glo.keys())