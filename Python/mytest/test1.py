#! /usr/bin/python
# _*_ coding:utf-8 _*_
# 文件名：test1.py

import os
import sys


print("==\n"+sys.argv[0])
print("arguments Length: "+str(len(sys.argv))+"\n")
'''
print("arguments infos: \nargv1:"+sys.argv[1]+"\n")
print("argv2:"+sys.argv[2]+"\n")

print("\n===============================\n")
for args in sys.argv:
    print("==: "+args+"\n")
print("\n===============================\n")
'''
n1 = 100
n2 = 200
n3 = 300

num = n1+\
    n2+\
    n3
days = {"1","2","3",
        "4","5"}

if True:
    print("true")
    sys.stdout.write("成")
    print(os.name)
else:
    print("false")
    print("不成")

print(num)
print(days)

var1 = 'v\nar1'
var2 = "va\nr2"
var3 = """va\nr3
ssstestdox....
"""

print(var1+var2+var3)

# a test.py
print("a test.py")
var4 ="""
+++++++++++++++++++++++++++++++++++++++++++++++
ssssssssssssssss
ssssssssssssssss
+++++++++++++++++++++++++++++++++++++++++++++++
"""

print(var4)

#raw_input("dox\ndox\npress any key")

import sys; x="runables";sys.stdout.write("dox\n"+x+"\n")