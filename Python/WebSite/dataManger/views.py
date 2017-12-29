# -*- coding: utf-8 -*-

from dataManger import app
from flask import render_template
from forms import LoginForm
from flask import flash, redirect


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/search')
def search():
    return ''


@app.route('/login', methods = ['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for OpenID="' + form.openid.data + '", remember_me=' + str(form.remember_me.data))
        return redirect('/index')
    return render_template('login.html',
        title = 'Sign In',
        form = form)