#!/usr/bin/python
# coding: utf-8

import myftp

ftp_server = '211.149.241.190'
portnum = '21'
username = 'cdms2015'
password = 'NIEhao12300632'
if __name__=='__main__':
  lf = myftp.MyFTP()
  lf.ConnectFTP(ftp_server,portnum,username,password)
  lf.download(ftp_server,portnum,username,password,"/backup","/webroot")
  #lf.upload("10.18.111.70","21","user","passwd","localfile","remotefile")