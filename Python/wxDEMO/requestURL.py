# coding: utf-8
import urllib
import os
import sys
reload(sys)
sys.setdefaultencoding('gbk')

filename = "t.py"
filedir = "wwwroot"
createfilecmd = "copy nul "+filename
createfiledir = "mkdir "+filedir
urlfiepath = urllib.urlopen("http://3g.ccddzyy.com")
urlcodeString = urlfiepath.read()

fname = "3gccddzyycom.html"
cmdstr = "mkdir wwwroot"
os.system(cmdstr)

cmdstr = "copy nul "+fname
os.system(cmdstr)

htmlfile = open(fname,"w")
htmlfile.write(urlcodeString)
htmlfile.close()

cmdstr = "copy "+fname+" wwwroot"
os.system(cmdstr)

cmdstr = "del "+fname
os.system(cmdstr)