#! /usr/bin/python
# _*_ coding:utf-8 _*_
# 文件名：test2.py

import sys,os
import random
print "Content-type:text/html"
print
var1,var2,var3 = "r1","r2","r3"
num1 = 10
num2 = 40

print(var1+"\n"+var2+"\n"+var3+'\n')
print(num2)
del num2

print(num1)

num = random.choice(range(10))
print("\n<br>\n")
print(num)

ranNUM = random.random()
print("\n<br>\n")
print(ranNUM)


str1 = "robret dox"
str2 = "dox memenber"

print("str1[0]:"+str1[1:4])
print("\n")
print("str2: "+str2[:6]+" =122222")
print("\n")
print(str2)
print("\n")
print(str1*2)
print("\n")
print(R"\n")
print('ob' in str1)
print("\n")
print('名' not in str1)

print("this is %s dox fo %d meberds" % ("ro",44))

def sum(x,y):
    return x+y

if __name__ == "__main__":
    print(sum(10,4))
    print("\n")
    print(str2.center(50,'4'))
    print("\n")
    print(str2.capitalize())