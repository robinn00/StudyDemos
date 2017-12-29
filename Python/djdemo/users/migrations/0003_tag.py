# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-27 08:20
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_uwork'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('uinfo_pr', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.uinfo')),
            ],
        ),
    ]