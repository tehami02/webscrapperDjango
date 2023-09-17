# Property Web Scraper

This Django app allows you to scrape property data and store it in a MongoDB database.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Python 3.x installed on your system.
- A MongoDB database or connection URI.
- Git installed on your system.

## Clone the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/property-web-scraper.git
cd property
```

Then,
```bash
pip install -r requirements.txt
```

## Configure other settings in the .env file, such as SECRET_KEY, DEBUG, and ALLOWED_HOSTS .
## Specially your SECRET_KEY , MONGODB_URI , DB_NAME and DRIVER_PATH as ChromeDriver runs for scrapping data.
   

```bash
python manage.py migrate
python manage.py runserver
```

## Open your web browser and go to http://127.0.0.1:8000/ to access the web scraper.
## .env contains my MONGODB_URI 

Enter a city name and click the "Scrape" button to retrieve property data. The scraped data will be stored in the MongoDB database.
Collection will be created automatically , just specify DB_NAME and MONGODB_URI correctly.

![Screenshot (341)](https://github.com/tehami02/webscrapperDjango/assets/93815993/7902d0c7-461e-4e62-935f-3c74f9442058)


## WAIT FOR 10 to 20 Seconds

You can also access the property list at http://127.0.0.1:8000/property_list/city-name/.

![Screenshot (310)](https://github.com/tehami02/webscrapperDjango/assets/93815993/eb5a4e3d-b155-496e-a99b-302cd587836f)


## MongoDB screenshot -
![Screenshot (561)](https://github.com/tehami02/webscrapperDjango/assets/93815993/3ab7356f-64fb-42e3-ae17-d77db5394225)


