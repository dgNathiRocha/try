# Generated by Django 4.2.7 on 2023-11-25 07:23

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("database", "0008_sleephealth"),
    ]

    operations = [
        migrations.AlterField(
            model_name="sleephealth",
            name="age",
            field=models.IntegerField(),
        ),
    ]
