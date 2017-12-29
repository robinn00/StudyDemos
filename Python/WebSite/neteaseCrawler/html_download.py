# -*- coding: utf-8 -*-

import requests


class htmlDownload(object):
    
    def download(self, url):
        if url is None or url == '':
            return
        try:
            response = requests.get(url, timeout=5)
        except:
            return
        
        if response.status_code != 200:
            return
        
        return response.content
