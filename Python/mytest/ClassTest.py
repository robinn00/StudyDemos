#! /usr/bin/python
# _*_ coding:utf-8 _*_


import pyclass.Employee as e
import pyclass.Coder as c
import Point as p
import re
print("Content-type:text/html")
print
if __name__ == "__main__":
    print("#########################################")
    emp1 = e.Employee("robinn","4512")
    emp1.displayCount()
    emp1.displayEmp()

    emp2 = e.Employee("dox","58111")
    emp2.displayCount()
    emp2.displayEmp()

    emp2.name = "ddddddd"
    emp2.salary = "999999"
    emp2.displayEmp()

    del emp2.salary
    emp2.displayEmp()

    flag1 = hasattr(emp2,"name")
    name_val = getattr(emp2,"name")
    setattr(emp2,"name","454578")
    setattr(emp2,"x1",123)
    setattr(emp2,"y1",456)

    print(flag1,name_val,emp2.name,emp2.x1,emp2.y1)
    print("#########################################")

    print(e.Employee.__doc__)
    print(emp1.__doc__)

    print(e.Employee.__dict__)
    print(emp1.__dict__)

    print(e.Employee.__name__)

    print(e.Employee.__module__)
    print(emp1.__module__)

    print(e.Employee.__bases__)

    emp2 = emp1
    emp2.displayCount()
    emp2.displayEmp()

    emp3 = emp2
    print(id(emp1),id(emp2),id(emp3))
    del emp1
    del emp2
    del emp3

    p1 = p.Point(20,30)
    p2 = p1
    p3 = p1

    print(id(p1),id(p2),id(p3))
    del p1
    del p2
    del p3

    print("#########################################")
    coder = c.Coder("xx","uu")
    coder.displayCount()
    coder.displayEmp()
    print("#########################################")

    print(issubclass(e.Employee, c.Coder))
    print(isinstance(coder,c.Coder))

    print("==================================")
    reobj = re.match('hello','hello chengdu')
    print(reobj)
    print(re.match('chengdu','hello chengdu'))
    print(reobj.span())

    pattern = re.compile("dox")
    matchs = pattern.match("dox helo")
    if matchs:
        print(matchs.group())