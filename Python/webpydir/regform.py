#! /usr/bin/python
# _*_ coding:utf-8 _*_

from flask import Flask
from flask import request
from flask import redirect
from flask import render_template
from flask import session
from flask import escape
from flask import url_for
import os

app = Flask(__name__)
app.secret_key = os.urandom(25)

@app.errorhandler(404)
def getEr(error):
    return render_template("error.html"),404


@app.route('/')
def index():
    return render_template('loginform.html')

@app.route("/login",methods=['POST','GET'])
def login():
    if request.method == 'POST':
        if request.form['uname'] == '' or request.form['upws'] == '':
            return render_template("yanzheng.html")
        session['uname'] = request.form['uname']
        session['upws'] = request.form['upws']

        return render_template('regsucess.html',uname=escape(session['uname']),upws=session['upws'])
    else:
        return redirect(url_for("index"))

@app.route("/session")
def session_t():
    uname = None
    upws = None
    try:
        uname = session['uname']
        upws = session['upws']
    except:
        return "No session....."

    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')
    return "uname:" + str(uname) + " == <br><hr>upws:" + str(upws)


@app.route("/loginOut")
def loginOut():
    session.pop('uname',None)
    session.pop('upws',None)
    return redirect(url_for('index'))

if __name__ == "__main__":
    app.run()