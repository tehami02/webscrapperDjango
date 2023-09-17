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

Then,

pip install -r requirements.txt

Configure other settings in the .env file, such as SECRET_KEY, DEBUG, and ALLOWED_HOSTS .
Specially your SECRET_KEY and MONGODB_URI and DB_NAME

python manage.py migrate

python manage.py runserver

Open your web browser and go to http://127.0.0.1:8000/ to access the web scraper.

Enter a city name and click the "Scrape" button to retrieve property data. The scraped data will be stored in the MongoDB database.

You can also access the property list at http://127.0.0.1:8000/property_list/{city}/.
