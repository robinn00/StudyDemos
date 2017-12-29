#! /usr/bin/python
# _*_ coding:utf-8 _*_

import Employee as e

class Coder(e.Employee):
    ecount = 20

    '''
    def __init__(self, namex="name_1", salaryx="salary_1"):
        e.Employee.__init__(self,namex,salaryx)
        self.name = namex
        self.salary = salaryx
        Coder.ecount += 1
        print("Coder sub.....")
    '''

    def displayCount_x(self):
        print(Coder.ecount)

    def displayEmp_x(self):
        print(self.ecount, self.name, self.salary)