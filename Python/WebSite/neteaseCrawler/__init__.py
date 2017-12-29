# -*- coding: utf8 -*-

import pymysql
conn = pymysql.connect(host='127.0.0.1', 
                       user='root', 
                       passwd='cidao1!',
                       db='netease', charset='utf8')

cur = conn.cursor()