#!/usr/bin/python
# -*- coding: UTF-8 -*-

import win32api
import win32con
num = win32api.MessageBox(win32con.NULL, u'Python MsgBox', u'温馨提示', win32con. MB_OK)
print(num)