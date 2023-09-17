# utils.py

from pymongo import MongoClient
from django.conf import settings

def insert_data_into_mongodb(data):
    client = MongoClient(settings.MONGODB_URI)
    db = client['webscrapper']  # Replace with your actual database name
    collection = db['scrapper_scrapedproperty']  # Replace with your actual collection name

    # Insert the data into MongoDB
    collection.insert_many(data)
