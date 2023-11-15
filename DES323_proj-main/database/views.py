from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import *
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login
import requests
# Create your views here.
def database_item_list_all(request):
    dataset_objs = settingtool.objects.all()
    context_data = {
        "filter_type":"All",
        "datasets":dataset_objs
    }
    return render(request, 'web/settings.html', context= context_data)

def database_all_item(request):
    dataset_objs = userall.objects.all()
    context_data = {
        "filter_type":"All",
        "datasets":dataset_objs
    }
    return render(request, 'database/list_name.html', context= context_data)

def user_name(request):
    dataset_objs = userall.objects.all()
    context_data = {
        "filter_type":"All",
        "datasets":dataset_objs
    }
    return render(request, 'web/userinfo.html', context= context_data)

def database_login_add(request):
    if request.method == "POST":
        form_data = request.POST
        new_item = userall(
            first_name = form_data[ 'first_name' ],
            last_name = form_data[ 'last_name' ],
            account = form_data[ 'account' ],
            email = form_data[ 'email' ],
            password = form_data[ 'password' ]

        )
        try:
            new_item.save()
        except:
            return HttpResponse ("ERROR!" )
        return redirect ('/home')
    context_data = {
        'item_id' : "New",
        'form_data' :{
           'first_name':"",
           'last_name':"",
           'account':"",
           'email':"",
           'password':"",

            }
    }
    return render(request, 'web/login.html' , context= context_data)

def signup(request):
    if request.method == "POST":
        fname = request.POST['first_name']
        lname = request.POST['last_name']
        user = request.POST['account']
        email = request.POST['email']
        password = request.POST['password']

        myuser = User.objects.create_user(user, password)
        myuser.first_name = fname
        myuser.last_name = lname
        myuser.save()

        messages.success(request, "Your account has been successfully created.")


        return redirect('/home')
    return render(request, 'web/login.html')


def signin(request):

    if request.method == 'POST':
        username = request.POST['account']
        password = request.POST['password']


        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            fname = user.first_name
            return render(request, "web/signin.html", {'fname': fname})

        else:
            messages.error(request, "Bad Credentials")
            return redirect('/home')

    return render(request, 'web/signin.html')

def database_item_edit(request, id):

    try:
        item = userall.objects.get(id = id)
    except:
        return HttpResponse("ID Not found")
    if request.method == "POST":
        
        form_data = request.POST

        
        item.first_name = form_data['first_name']
        item.last_name = form_data['last_name']
        item.account = form_data['account']
        item.email = form_data['email']
        item.password = form_data['password']
        try:
            item.save()
            
        except:
            return HttpResponse("ERROR!")
        return redirect('/setting')
    context_data = {
        'item_id': id,
        'form_data':{
            'first_name':item.first_name,
            'last_name':item.last_name,
            'account':item.account,
            'email':item.email,
            'password':item.password,

    }
    
}
    print(database_item_edit)
    return render(request, 'web/settings.html', context= context_data)



def data_sci_item_delete(request, id):
    dataset_objs = userall.objects.filter(id = id)
    if len(dataset_objs) <= 0:
        return HttpResponse("ID Not found")
    dataset_objs.delete()
    return redirect('/login')


def signout(request):
    logout(request)
    messages.success(request, "Logout")
    return redirect('/signin')



def api_data(request):
    api_url="https://api.themoviedb.org/3/search/movie?api_key=5395578a0f7c6ad459be7ddae34b26c7&query=Harry Potter"
    response= requests.get(api_url)
    print(response.json())
    return JsonResponse(response.json())
