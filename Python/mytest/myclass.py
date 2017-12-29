#! /usr/bin/python
# _*_ coding:utf-8 _*_
class A1:
    print("xx")
    def __init__(self):
        print("xxx")

    def adox(self):
        print("adoxxxx")

class B1(A1):
    print("yy")

    def __init__(self):
        print("yyyyy")

    def dox(self):
        print("doxxxxx")

class Think:
    'this is a think CLASS'
    username = "uinfo"
    userpass = "upws"

    def __init__(self,uname,upws):

        'this is a __init__'

        self.username = uname
        self.userpass = upws

    def showinfo(self):
        'this is afunction showinfo'
        print(self.username)
        print(self.userpass)

if __name__ == "__main__":
    th = Think("robinn","123456")
    th.__init__("dox","1111")
    th.showinfo()
    print(th.__doc__)
    print(th.__init__.__doc__)
    print(th.showinfo.__doc__)
    print("################")
    print(th.__module__)
    print(__name__)
    print(th.__class__)
    print(th.__dict__)


    b = B1()
    b.dox()
    print(B1.__bases__)