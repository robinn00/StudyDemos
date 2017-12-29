#! /usr/bin/python
# _*_ coding:utf-8 _*_

import os

def readHtml(url):
    fso = open(url,"r")

    print(fso.closed)
    print(fso.name)
    print(fso.mode)

    #fso.write("xxxxx")
    print(fso.read(-1))

    print(fso.tell())

    fso.close()

if __name__ == "__main__":
    filepath = "html/123.html"
    readHtml(filepath)

    #os.remove("html/dox.txt")

    #os.mkdir("dox")

    #print(os.chdir("html"))
    print(os.getcwd())
    #os.rmdir("dox")

    # os.rename(filepath,"html/123.html")

