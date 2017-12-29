# -*- coding: UTF8 -*-
import json
import os
import re
import multiprocessing
import requests

path = ''


def SaveTouTiaoData(HtmlCode, title):
    global path
    data = HtmlCode.xpath('//div[@class="article-content"]//*/text()|//div[@class="article-content"]//*/@src')
    if len(data):
        try:
            title = title.replace('|', '').replace('"', '”').replace('?', '？')
            with open(os.path.join(path, title + '.txt'), 'w') as file:
                for i in range(0, len(data)):
                    file.write(data[i] + '\r\n')
        except IOError:
            print '[IOError]: ' + title


from config import search, queue


class JinRiTouTiaoCrawler(multiprocessing.Process):
    def __init__(self, MAXCount):
        multiprocessing.Process.__init__(self)
        self.keyWords = ['自闭症', '遗尿症', '抽动症', '发育迟缓', '多动症', '智力低下']
        self.workStatus = False
        self.MAXCount = MAXCount

    def dispose(self, data):
        for i in range(self.MAXCount):
            try:
                currentData = data[i]
            except IndexError:
                continue
            if re.search('toutiao.com', currentData.get('article_url')):
                queue.put([currentData.get('article_url'), currentData.get('title')])

    def run(self):
        print '[info]: 开始采集今日头条'
        global path
        search.start()
        for keyWord in self.keyWords:
            nextOffset = 0
            path = keyWord
            try:
                path = os.path.join(os.path.abspath(os.path.dirname(__file__)), u'今日头条', keyWord)
                os.makedirs(path)
            except WindowsError:
                pass

            while True:
                try:
                    htmlCode = requests.get('http://www.toutiao.com/search_content/?offset=' +
                                            str(nextOffset) + '&format=json&keyword=' + keyWord +
                                            '&autoload=true&count=' + str(self.MAXCount)).content
                    html = json.loads(htmlCode)
                except ValueError:
                    continue
                if nextOffset != html.get('offset'):
                    nextOffset = html.get('offset')
                    self.dispose(html.get('data'))
                else:
                    break
        print '[info]: 今日头条采集完毕'

    def stop(self):
        search.stop()
