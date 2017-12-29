from django import forms

class addForms(forms.Form):
    a = forms.IntegerField()
    b = forms.IntegerField()