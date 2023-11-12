from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render, redirect
from .models import *
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
            new_item. save()
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