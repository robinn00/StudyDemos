#! /usr/bin/python
# _*_ coding:utf-8 _*_

class Employee:

    'all Employee base'
    ecount = 0
    name = "name"
    salary = "1500"

    def __init__(self,name_,salary_):
        '__init__'
        self.name = name_
        self.salary = salary_
        Employee.ecount += 1
        print("Employee base.....")

    def displayCount(self):
        'displayCount'
        print("All Employee is count: "+str(Employee.ecount))

    def displayEmp(self):
        'displayEmp'
        print("Employee: name is: "+self.name+",salary is: "+self.salary)