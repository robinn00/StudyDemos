# -*- coding: utf8 -*-

from flask import Flask
import sys
import os

sys.path.append('..')
from WebSite import config  # @UnresolvedImport

app = Flask(__name__, static_folder=os.path.join(config.basePath, 'static'),
            static_url_path='')

app.config.from_object('config')
from views import *
