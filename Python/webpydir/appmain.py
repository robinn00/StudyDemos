#! /usr/bin/python
# _*_ coding:utf-8 _*_

from flask import Flask,url_for
from flask import render_template

app = Flask(__name__)
app.debug = True

@app.route('/')
def dox():
    return "doxing...<br><hr style='color:red;height:10px;width:100%;border:2px solid red;'>"

@app.route("/dox")
def dox_():
    return "<span style='color:red;font-weight:bold;'>dox........</span><hr>"


@app.route("/about/<username>")
def about(username):
    return "this is name: %s" % username

@app.route("/about/<int:age>")
def aboutAge(age):
    return "this is age: %d" % age

'''
@app.route("/users/")
def users():
    return "users/users/"
'''

@app.route("/users")
def usersx():
    return "users<br><a href='"+url_for('about',username='robinn')+"'>testing</a>"

@app.route("/index")
@app.route("/index/<uname>")
def index(uname=''):
    return render_template("main.html",usernames=uname)

if __name__ == "__main__":
    app.run(host='192.168.0.201', port=7890)

    '''
    with app.test_request_context():
        print url_for('dox_')
        print url_for('about',username='robinn')
        print url_for('usersx')
        print url_for('usersx',name='xxx')
    '''