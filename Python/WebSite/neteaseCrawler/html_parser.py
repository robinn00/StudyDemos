# -*- coding: utf-8 -*-
from lxml import etree
import re
from urlparse import urljoin
import sys
reload(sys)
sys.setdefaultencoding('utf-8')  # @UndefinedVariable

class HtmlParser(object):
    def _get_appint_urls(self, page_url, html):
        new_urls = set()
        links = html.xpath('//a/@href')
        for link in links:
            if re.search('^http://ek.39.net/', link):
                new_urls.add(urljoin('http://ek.39.net', link))
        return new_urls
    

    def _get_data(self, page_url, html):
        data = dict()
        data['url'] = page_url
        data['title'] = html.xpath('//div[@class="art_box"]/h1/text()')
        data['content'] = html.xpath('//*[@id="contentText"]//*/text()|//div[@class="cen"]//*/text()\
                            |//*[@id="contentText"]//*/@src')
        return data
    
    def parser(self, page_url, html_content):
        if html_content is None or html_content == '' \
            or page_url is None or page_url == '':
            return
        html = etree.HTML(html_content, parser=etree.HTMLParser(encoding='gb2312'))
        new_urls = self._get_appint_urls(page_url, html)
        new_content = self._get_data(page_url, html)
        return new_urls, new_content
    
