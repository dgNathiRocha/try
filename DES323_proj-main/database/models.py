from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class HR_description(models.Model):
    employee_name = models.CharField(max_length=255)
    empID = models.IntegerField()
    Salary = models.IntegerField()
    position = models.CharField(max_length=255)
    state = models.CharField(max_length=10)
    sex = models.CharField(max_length=10)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, default=None)
    added_date = models.DateTimeField(default=timezone.now)

class Department(models.Model):

    department_name = models.CharField(max_length=255)

class HR_department(models.Model):

    HR_description = models.ForeignKey(HR_description, on_delete=models.CASCADE)
    departmant = models.ForeignKey(Department, on_delete=models.CASCADE)



class settingtool(models.Model):

    proj_name = models.CharField(max_length=255)
    Date = models.DateField(null=True)
    type_v = models.CharField(max_length=255)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, default=None)
    added_date = models.DateTimeField(default=timezone.now)


class userall(models.Model):

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    account = models.CharField(max_length=255)
    email =  models.CharField(max_length=255)
    password  = models.CharField(max_length=255)

