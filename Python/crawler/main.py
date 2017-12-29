# -*- coding: UTF8 -*-
import thread
from toutiaoCrawler import JinRiTouTiaoCrawler
from tencentCrawler import Tencent
from config import MAXCount

if __name__ == '__main__':
    tencent = Tencent()
    touTiaoCrawler = JinRiTouTiaoCrawler(MAXCount)
    try:
        tencent.start()
        touTiaoCrawler.start()
    except KeyboardInterrupt:
        tencent.stop()
        touTiaoCrawler.stop()
        exit()

