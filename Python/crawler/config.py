# -*- coding: UTF8 -*-

import Queue
from Crawler import ThreadQueue

# 控制一页显示多少数据
MAXCount = 50
# 最大线程数
ThreadMaxSize = 50
# 建立全局队列
queue = Queue.Queue(maxsize=ThreadMaxSize)

search = ThreadQueue(queue)

