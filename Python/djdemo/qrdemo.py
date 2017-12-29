#! /usr/bin/python
#_*_ coding:utf-8 _*_

import qrcode
if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding("utf-8")
    qxr = qrcode.make("http://3g.kzdz120.com")
    with open('3gkzdz.jpg', 'wb') as f:
        qxr.save(f)