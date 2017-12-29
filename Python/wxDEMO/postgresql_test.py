#!/usr/bin/python
# -*- coding: UTF-8 -*-
import psycopg2


conn = psycopg2.connect(database="test", user="postgres", password="robinn", host="127.0.0.1", port="5432")

cur = conn.cursor();
cur.execute("select * from users");
rows = cur.fetchall();
for row in rows:
    print("id: ", row[0]);
    print("uname: ", row[1]);
    print("upws: ", row[2]);
print("PostgreSQL connected successful!");


print("成功了！");
