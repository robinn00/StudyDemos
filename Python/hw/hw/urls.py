"""hw URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""


"""
from django.conf.urls import *
from view import hl

urlpatterns = patterns("",
                       ('^hl/$', hl),
                       )
"""
from django.contrib import admin
from django.conf.urls import include,patterns
admin.autodiscover()

from django.conf.urls import url
from view import hl
from testdb import testdb
from selectdb import selectAllinfo
from updatedb import updateInfo
from deletedb import delinfo
from getForm_main import showgetForm,getSubmit
from postForm_main import showpostForm,postSubmit

urlpatterns = [
    url(r'^hl/$', hl),
    url(r'^testdb/$', testdb),
    url(r'^selectAllinfo/$',selectAllinfo),
    url(r'^updateInfo/$',updateInfo),
    url(r'^delinfo/$',delinfo),
    url(r'^showgetForm/$',showgetForm),
    url(r'^get/$',getSubmit),
    url(r'^showpostForm/$',showpostForm),
    url(r'^postx/$',postSubmit),
    url(r'^admin/',admin.site.urls)
]