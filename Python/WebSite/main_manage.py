# -*- coding: utf-8 -*-

from neteaseCrawler import url_manage, html_download, html_parser, output_data
import sys

reload(sys)
sys.setdefaultencoding('utf-8')  # @UndefinedVariable
class mainManage(object):
    def __init__(self):
        self.urls = url_manage.urlManage()
        self.htmlDownload = html_download.htmlDownload()
        self.htmlParser = html_parser.HtmlParser()
        self.output = output_data.OutputData()

    def spider(self, root_url):
        count = 1
        self.urls.add_new_url(root_url)
        while self.urls.has_new_url():
            new_url = self.urls.get_new_url()
            print 'spider: %d ---- url: %s' % (count, new_url)
            html_content = self.htmlDownload.download(new_url)
            try:
                new_urls, new_data = self.htmlParser.parser(new_url, html_content)
            except TypeError:
                continue
            else:
                self.urls.add_new_urls(new_urls)
                self.output.mysql(new_data)
            finally:
                count += 1
                
    def run(self, root_url):
        if self.urls.has_new_url():
            # 有数据传送空字符串. 恢复爬虫进度
            root_url = ''
        self.spider(root_url)
    
if __name__ == '__main__':
    spider_object = mainManage()
    spider_object.run('http://ek.39.net/')
