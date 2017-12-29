#! /usr/bin/python
# _*_ coding:utf-8 _*_
# mysql_.py (mysql数据库操作)

import MySQLdb

print "Content-type:text/html"
print

db = MySQLdb.connect("127.0.0.1", "root", "root", "mysql")
cursor = db.cursor()
cursor.execute("select Host,User,Password from User")
# info = cursor.fetchone()
infos  = cursor.fetchall()

for info_ in infos:
    print("<span>"+info_[0]+"  "+info_[1]+"  "+info_[2]+"</span><br>")

db.close()