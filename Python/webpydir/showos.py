#! /usr/bin/python
# _*_ coding:utf-8 _*_

from flask import url_for,Flask,render_template
app = Flask(__name__)

def openOsfile():
    lists = []
    num = -1
    #with open('static/os.txt', "rb") as fso:
    with open(url_for("static", filename='os.txt').lstrip('/'), "rb") as fso:
        while True:
            line = fso.readline()
            if not line:
                break
            else:
                num += 1
                if num == 0:
                    lists.append(""+line+"")
                else:
                    lists.append(line)
    return lists


@app.route("/")
def index():
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')
    return render_template("testos.html",lines=openOsfile())




@app.route("/set")
def setinfo():
    s = ('oneline','tlines','dslines','doxlines')
    return render_template("setinfo.html",lines=s)




if __name__ == "__main__":
    app.run(debug=True, host='192.168.0.201', port=1456)

    '''
    list_ = (openOsfile())
    for sx in list_:
        print(sx)
    '''