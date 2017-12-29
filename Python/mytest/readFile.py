#! /usr/bin/python
# _*_ coding:utf-8 _*_

import sys
print "Content-Disposition: attachment; filename=\"foo.txt\"";
print

fso = open("foo.txt",'rb')
type=sys.getfilesystemencoding()
print (fso.read()).decode(type).encode('utf-8')
fso.close()