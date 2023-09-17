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
## Specially your SECRET_KEY and MONGODB_URI and DB_NAME

```bash
python manage.py migrate
python manage.py runserver
```

## Open your web browser and go to http://127.0.0.1:8000/ to access the web scraper.

Enter a city name and click the "Scrape" button to retrieve property data. The scraped data will be stored in the MongoDB database.
![Screenshot (341)](https://github.com/tehami02/webscrapperDjango/assets/93815993/5b6f8359-a40f-4754-8031-297e615802a2)

## WAIT FOR 10 to 20 Seconds

You can also access the property list at http://127.0.0.1:8000/property_list/city-name/.

![Screenshot (310)](https://github.com/tehami02/webscrapperDjango/assets/93815993/0fd9e24b-28b4-43bc-9b92-65e54bfa59d8)

## MongoDB screenshot -
![image](https://github.com/tehami02/webscrapperDjango/assets/93815993/f98aac1b-3b70-46d5-b1ce-3d7633176fdb)

