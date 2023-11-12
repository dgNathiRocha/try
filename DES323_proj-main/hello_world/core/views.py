from django.shortcuts import render, redirect
from django.http import JsonResponse

import pandas as pd
from database.models import HR_description

import requests
import numpy as np
from sklearn import preprocessing, svm
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

from .forms import UploadFileForm



def index(request):
    context = {
        "title": "Django example",
    }
    return render(request, "web/index.html", context)


#def setting(request):
    context = {
        "title": "Setting Example",
    }
    return render(request, "web/settings.html",context)


def home(request):
    context = {
        "title": "Home Example",
    }
    return render(request, "web/home.html",context)

def login(request):
    context = {"title": "Login"}
    return render(request, "web/login.html",context)

def import_data_csv(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            uploaded_file = form.cleaned_data['file']
            try:
                if uploaded_file.name.endswith('.csv'):
                    df = pd.read_csv(uploaded_file)
                elif uploaded_file.name.endswith('.json'):
                    df = pd.read_json(uploaded_file)
                else:
                    return render(request, 'upload_csv.html', {'form': form, 'error_message': 'Invalid file format.'})
                
                # Convert the DataFrame to an HTML table for rendering
                table_html = df.to_html(classes='table table-striped')
                
                # Redirect to the view_data page with the table data
                return render(request, 'view_data.html', {'table_html': table_html})
            except Exception as e:
                return render(request, 'upload_csv.html', {'form': form, 'error_message': 'Invalid file format or structure.'})
    else:
        form = UploadFileForm()
    
    return render(request, 'upload_csv.html', {'form': form})

def call_request_externel_api(request):
    api_url="https://api.open-meteo.com/v1/forecast?latitude=14.0135&longitude=100.5305&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=Asia%2FBangkok&start_date=2023-10-18&end_date=2023-10-25"
    response=requests.get(api_url)
    print(response.json())
    return JsonResponse(response.json())



def classification(request):
    # Assuming 'position' is a categorical variable you want to predict
    positions = list(HR_description.objects.all().order_by('id').values_list('position', flat=True))
    salaries = list(HR_description.objects.all().order_by('id').values_list('Salary', flat=True))

    X = np.array(salaries).reshape(-1, 1)
    y = np.array(positions)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25)

    classifier = LogisticRegression()
    classifier.fit(X_train, y_train)

    y_pred = classifier.predict(X)

    # Please note that you may need to adapt this section based on your specific classification task
    # You can replace this with the appropriate evaluation and visualization logic for your classification results

    # Here, we just return the predicted positions
    json_output = {
        'position': positions,
        'salaries': salaries,
        'predicted_positions': list(y_pred.flat)
    }
    return JsonResponse(json_output)

def import_csv(request):
    if request.METHOD == "POST":
        file = request.FILES['file']
        obj = File.objects.create(file = file)
    return render(request , 'main.html')

def create_db(file_path):
    df = pd.read_csv(file_path, delimiter=',')
    list_of_csv = [list(row) for row in df.values]
