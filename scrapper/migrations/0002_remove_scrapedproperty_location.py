# Generated by Django 4.1.2 on 2023-09-17 10:21

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("scrapper", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="scrapedproperty",
            name="location",
        ),
    ]