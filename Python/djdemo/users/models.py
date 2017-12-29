from __future__ import unicode_literals

from django.db import models


# Create your models here.
class uinfo(models.Model):
    u_name = models.CharField(max_length=35)
    u_sex = models.CharField(max_length=5)
    u_addr = models.CharField(max_length=56)
    u_age = models.IntegerField()
    u_msg = models.CharField(max_length=25, default='', editable=False)

    def __unicode__(self):
        return self.u_name

class uwork(models.Model):
    ucmp = models.CharField(max_length=30)
    uaddr = models.CharField(max_length=30)

    def __unicode__(self):
        return self.ucmp

class Tag(models.Model):
    uinfo_pr = models.ForeignKey(uinfo)
    name = models.CharField(max_length=20)

    def __unicode__(self):
        return self.name