# -*- coding: utf-8 -*-

from neteaseCrawler import cur, conn
import pymysql
import re

class OutputData(object):
    
    def output_content_replace(self, content):
        content = content.replace('以上内容仅授权39健康网独家使用，未经版权方授权请勿转载。', '')
        content = content.replace('39健康网(www.39.net)专稿，未经书面授权请勿转载。', '')
        content = content.replace('39健康网（www.39.net）独家专稿，欢迎分享，请点击获取授权。投稿及合作请联系：020-85501999-8802', '')
        return content
    
    def mysql(self, data):
        if data['title'] is None or len(data['title']) == 0:
            return 
        
        str = list()
        for text in data['content']:
            # 过滤文章
            if re.search('http[\s\S]+.js', text):
                continue
            if re.search('//<!', text):
                continue
            if re.search('ac_', text):
                continue
            if text == '\r\n' or text == '\n':
                continue
            if re.search('keycmd', text):
                continue
            
            str.append(text.replace('\r\n', '<br>').replace('\n', '<br>'))
        
        content = ''.join(str).replace('"', '\'')
        sql = 'insert into cms_content (id, title, content, updataTime,\
               postCount, spiderDate, summary, url) \
               value (null, "%s", "%s", null, null, null, null, "%s");' \
               % ((data['title'][0], self.output_content_replace(content), data['url']))
        cur.execute(sql)
        conn.commit()  # @UndefinedVariable
        
        