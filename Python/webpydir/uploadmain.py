#! /usr/bin/python
# _*_ coding:utf-8 _*_

from flask import Flask, url_for, request, render_template
from flask import make_response
from flask import abort
from flask import redirect

app = Flask(__name__)

@app.route("/error")
def err_test():
    return redirect(url_for("login"))

@app.route("/login_t")
def login():
    abort(404)


@app.errorhandler(401)
def page_not_401(error):
    return render_template("401.html"),401


@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"),404


@app.route("/")
def index():
    return render_template("uploadmain.html")

@app.route("/test")
def test():
    resp = make_response(render_template("uploadmain.html"))
    resp.set_cookie('username','robining.....')
    return resp


@app.route("/upload", methods=['POST', 'GET'])
def uploadForm():
    if request.method == 'POST':
        f = request.files['upfile']
        f.save(url_for("static",filename='dx.txt').lstrip('/'))
        return "<span style='color:red;font-weight:bold;font-size:12pt;'>" \
               "upload sucessful!...</span><script type='text/javascript'>window.alert('上传成功!');</script>"
    else:
        return 'Error...'

@app.route("/upload_tmp",methods=['POST', 'GET'])
def uploadFormTmp():
    if request.method == 'POST':
        f = request.files['upfile']
        f.save('static/'+ f.filename)
        uname = request.cookies.get('username')
        import sys
        reload(sys)
        sys.setdefaultencoding('utf8')
        return "<span style='color:red;font-weight:bold;font-size:12pt;'>" \
               "upload "+ uname +" sucessful!...</span><script type='text/javascript'>window.alert('上传成功!');</script>"
    else:
        return 'upload error......'

if __name__ == "__main__":
    app.run(debug=True,host='192.168.0.201',port=5623)