from pymongo import MongoClient
from django.conf import settings
import environ  # Import the config function
# Initialise environment variables
env = environ.Env()
environ.Env.read_env()

def insert_data_into_mongodb(data):
    client = MongoClient(env('MONGODB_URI'))  # Use config('MONGODB_URI') to get the value from .env
    db = client['webscrapper']  # Replace with your actual database name
    collection = db['scrapper_scrapedproperty']  # Replace with your actual collection name

    # Insert the data into MongoDB
    collection.insert_many(data)
