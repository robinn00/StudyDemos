# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-30 06:03
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_uinfo_u_info'),
    ]

    operations = [
        migrations.RenameField(
            model_name='uinfo',
            old_name='u_info',
            new_name='u_msg',
        ),
    ]
