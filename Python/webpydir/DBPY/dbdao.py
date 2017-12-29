#! /usr/bin/python
# _*_ coding:utf-8 _*_

import psycopg2

class db():
    def __init__(self,database,user,password,host,port):
        self.conn = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)
        pass

    def insertExe(self,sql,num,uname,uage,uaddr):
        try:
            self.cur = self.conn.cursor()
            self.cur.execute(sql,(num,uname,uage,uaddr))
            self.conn.commit()
            self.closeConn()
            return True
        except:
            return False

    def closeConn(self):
        self.cur.close()
        self.conn.close()
