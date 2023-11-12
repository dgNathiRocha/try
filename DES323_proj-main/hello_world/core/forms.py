# forms.py
from django import forms

class UploadFileForm(forms.Form):
    file = forms.FileField(label='Choose File', widget=forms.FileInput(attrs={'accept': '.csv, .json'}))
