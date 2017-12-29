# -*- coding: UTF8 -*-
import Queue
import requests
import threading
import re
import sys
from lxml import etree

reload(sys)
sys.setdefaultencoding('utf8')


# URL下载队列  多线程队列
class ThreadQueue(threading.Thread):
    def __init__(self, workQueue):
        threading.Thread.__init__(self)
        self.workQueue = workQueue
        self.threadStop = False

    def run(self):
        while not self.threadStop:
            try:
                from config import ThreadMaxSize
                threadWorks = [self.workQueue.get(block=True) for i in range(ThreadMaxSize)]
            except Queue.Empty:
                self.threadStop = True
                break

            # 启动多线程
            threadPools = [threading.Thread(target=crawler, args=(threadWork[0], threadWork[1],))
                           for threadWork in threadWorks]
            [threadPools[i].start() for i in range(len(threadPools))]
            [threadPools[i].join() for i in range(len(threadPools))]

    def stop(self):
        self.threadStop = True


def crawler(url, title):
    try:
        html = etree.HTML(requests.get(url=url).content)
    except requests.ConnectionError:
        return

    if re.search('toutiao.com', url):
        from toutiaoCrawler import SaveTouTiaoData
        SaveTouTiaoData(html, title)
    elif re.search('qq.com', url):
        from tencentCrawler import SaveTencentData
        if html.xpath('//*[@id="ArtPLink"]'):
            newURL = url.replace('.htm', '_all.htm')
            try:
                html = etree.HTML(requests.get(url=newURL).content)
            except requests.ConnectionError:
                return
            SaveTencentData(html, title)
        else:
            SaveTencentData(html, title)

