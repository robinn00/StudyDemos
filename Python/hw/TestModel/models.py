from __future__ import unicode_literals

from django.db import models


# Create your models here.

class Test(models.Model):
    uname = models.CharField(max_length=25)
    usex = models.CharField(max_length=13)
    uemail = models.CharField(max_length=20)
    uage = models.IntegerField()