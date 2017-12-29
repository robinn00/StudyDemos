# -*- coding: UTF8 -*-
import requests
import os
from lxml import etree
from config import queue, search
import multiprocessing

path = ''


class Tencent(multiprocessing.Process):
    def __init__(self):
        multiprocessing.Process.__init__(self)
        self.IndexUrl = ['http://baby.qq.com/l/pregnancy/list201407291756.htm',
                         'http://baby.qq.com/l/yingjiang/list201407291735.htm',
                         'http://baby.qq.com/l/jiankang/list201407291839.htm',
                         'http://baby.qq.com/l/xuexiao/list201407291429.htm',
                         ]
        self.workStatus = False

    def run(self):
        global path
        print '[info]: 开始采集腾讯网'
        search.start()
        for indexUrl in self.IndexUrl:
            htmlCode = requests.get(indexUrl).content
            html = etree.HTML(htmlCode)
            title = html.xpath('//title/text()')[0].replace('__腾讯网', '')
            try:
                path = os.path.join(os.path.abspath(os.path.dirname(__file__)), u'腾讯新闻', title)
                os.makedirs(path)
            except WindowsError:
                pass
            for i in range(1, int(html.xpath('//div[@class="pageNav"]/a[5]/text()')[0]) + 1):
                if i == 1:
                    url = indexUrl
                else:
                    url = indexUrl.replace('.htm', '_' + str(i) + '.htm')

                htmlCode = requests.get(url).content
                html = etree.HTML(htmlCode)
                for li in html.xpath('//ul[@id="piclist"]/li'):
                    title = li.xpath('div[@class="picText"]/p/a/text()')[0]
                    url = li.xpath('div[@class="picText"]/p/a/@href')[0]
                    queue.put([url, title])
        print '[info]: 腾讯网采集完毕'

    def stop(self):
        search.stop()


def SaveTencentData(HtmlCode, title):
    global path
    # //*[@id="Cnt-Main-Article-QQ"]
    data = HtmlCode.xpath('//*[@id="Cnt-Main-Article-QQ"]//*/text()|//*[@id="Cnt-Main-Article-QQ"]//*/@src')
    if len(data):
        try:
            title = title.replace('|', '').replace('"', '”').replace('?', '？')
            with open(os.path.join(path, title + '.txt'), 'w') as file:
                for i in range(0, len(data)):
                    file.write(data[i] + '\r\n')
        except IOError:
            print '[IOError]: ' + title
