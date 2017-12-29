#! /usr/bin/python
# _*_ coding:utf-8 _*_

from flask import Flask
from flask import url_for
from flask import render_template
from flask import request
from DBPY.dbdao import db
import random

app = Flask(__name__)
@app.route('/')
@app.route('/<parm>')
def index(parm=''):
    return render_template("myform.html",title=parm)


@app.route('/form', methods=['POST', 'GET'])
def navform():
    if request.method == 'POST':
        return '''
            uname is %s<br>
            uage is %s<br>
            uaddr is %s<br>
        ''' % (request.form['uname'], request.form['uage'], request.form['uaddr'])
    else:
        return 'request geting.....'

@app.route("/form_temp",methods=['POST','GET'])
def formtemp():
    num =random.randint(1,10)
    if request.method == 'POST':
        uname = request.form['uname']
        uage = request.form['uage']
        uaddr = request.form['uaddr']
        num += 20
        database = "test"
        user = "postgres"
        password = "robinn"
        host = "127.0.0.1"
        port = "5432"
        sql = "insert into users(id,uname,upws,uaddr) values(%s,%s,%s,%s);"

        '''
        conn = psycopg2.connect(database="test", user="postgres", password="robinn", host="127.0.0.1", port="5432")
        cur = conn.cursor()
        cur.execute("insert into users(id,uname,upws,uaddr) values(%s,%s,%s,%s);",(num,uname,uage,uaddr))
        conn.commit()
        cur.close()
        conn.close()
        '''



        dbobj = db(database, user, password, host, port)
        flag = dbobj.insertExe(sql, num, uname, uage, uaddr)
        dbobj.closeConn()

        if flag:
            return render_template("postformh.html",uname_x=uname,uage_x=uage,uaddr_x=uaddr)
        else:
            return 'No inserting....'
    else:
        return 'request geting.....'


if __name__ == "__main__":
    app.run(debug=True, host='192.168.0.201', port=4006)