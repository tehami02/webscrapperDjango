# models.py
from django.db import models

class ScrapedProperty(models.Model):
    project_name = models.CharField(max_length=255)
    locality = models.CharField(max_length=255)
    price_range = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    property_type = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    url = models.URLField()
