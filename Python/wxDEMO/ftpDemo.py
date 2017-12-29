# coding:utf-8
from ftplib import FTP
ftp = FTP('211.149.241.190')
ftp.login("cdms2015","NIEhao12300632")
ftp.retrlines('LIST')
ftp.quit()