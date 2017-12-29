# -*- coding: utf-8 -*-

from neteaseCrawler import cur, conn
import hashlib
import re

def _get_md5(value):
    md5 = hashlib.md5()
    md5.update(value)
    return md5.hexdigest()

class urlManage():
    def add_new_url(self, url):
        if url is None and url == '':
            return 
        if self.duplicate_record_search(url, 'new_urls') and \
            self.duplicate_record_search(_get_md5(url), 'old_urls'):
            # 不重复则插入数据
            self.insert_data(url, 'new_urls')
            
    def duplicate_record_search(self, value, tableName):
        # 返回 True 则没重复
        cur.execute('select url from %s where url="%s";' % (tableName, value))
        search = cur.fetchall()
        return search == ()
    
    def insert_data(self, value, tableName):
        # 插入记录
        cur.execute('insert into %s (id, url) values(null, "%s");' % (tableName, value))
        conn.commit()  # @UndefinedVariable
    
    def add_new_urls(self, urls):
        if urls is None or len(urls) == 0:
            return
        for url in urls:
            self.add_new_url(url)
            
    def has_new_url(self):
        cur.execute('select count(id) from new_urls;')
        return cur.fetchall()[0][0] != 0
            
    def get_new_url(self):
        # 取new_urls 第一条记录
        cur.execute('select url from new_urls limit 1;')
        new_url = cur.fetchall()
        if new_url == ():
            return 
        
        new_url = new_url[0][0]
        # 删除带爬取url 存入 已爬取 url列表
        cur.execute('delete from new_urls where url="%s";' % (new_url))
        self.insert_data(_get_md5(new_url), 'old_urls')
        return new_url
