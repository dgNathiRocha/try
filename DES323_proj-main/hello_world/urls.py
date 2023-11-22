"""hello_world URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from hello_world.core import views as core_views
from database import views as database_views

urlpatterns = [
    # ADMIN & MISC
    path("admin/", admin.site.urls),
    path("__reload__/", include("django_browser_reload.urls")),

    # DATABASE VIEWS
    path("setting", database_views.database_item_list_all),
    path("database/name", database_views.database_all_item),
    path("home", core_views.home),
    path("import/csv", core_views.import_data_csv),
    path("database/list_item/all", database_views.database_item_list_all),
    path("database/name/edit/<id>", database_views.database_item_edit),
    path("database/name/del/<id>", database_views.item_delete),
    path("api/movie", database_views.api_data),
    path("test", core_views.classification),
    path("data", core_views.import_data),
    path('api/json', database_views.api_register),


    # CORE VIEWS
    path("", core_views.index),
    path("home", core_views.home),
    path('import/csv', core_views.import_data_csv, name='import_data_csv'),
    path("example/external_api", core_views.call_request_externel_api),
    path("visualize/classification", core_views.classification),
    path("login", database_views.database_login_add),
    path("importcsv", core_views.import_csv),
    path("userinfo", database_views.user_name),
    path('signup', database_views.signup, name="signup"),
    path('signin', database_views.signin, name="signin"),
    path('signout', database_views.signout, name="signout"),
    path('horizontalhistogram', core_views.horizon),
    path('map', core_views.mapchart),
    path('bubblechart', core_views.bubblechart),
    path('boxchart', core_views.boxchart),
    path('finish', core_views.finish),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)