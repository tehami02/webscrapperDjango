# Property Web Scraper

## Live site (Netlify)

The Netlify application serves the city search at `/` and `/scrape/`, with saved
results at `/property_list/city-name/`. It preserves the original dark interface,
blue header, and property table. Enter a city and click **Scrape** to request
listings; successfully retrieved properties are stored in Netlify Database.
Repeated city/property URLs update existing records instead of creating duplicates.
The original Django source remains available for local development.

### Deploy and develop

Netlify publishes `public/` and deploys the TypeScript endpoint at
`/api/properties`. No Django server, MongoDB URI, or local ChromeDriver is needed
for the hosted version. Netlify provisions its managed Postgres database and
applies the migration in `netlify/database/migrations/` during deployment.

```bash
npm ci
npm run dev
```

Open `http://localhost:8889`. Use `npm test` and `npm run typecheck` to validate
changes. Define database changes in `db/schema.ts` and generate migrations with
`npx drizzle-kit generate --name describe_your_change`; Netlify applies them.

### Source availability

99acres can deny automated requests with HTTP 403 or require browser verification.
This was observed during deployment troubleshooting. The hosted scraper reads
public HTML and structured listing data; it cannot bypass source access controls
or execute browser-only pages. A blocked request shows an explicit error, retains
saved records, and offers a link to open the city on 99acres. An empty saved list
means no listings have been saved for that city; it does not imply there are no
properties on the source site. No sample listings are presented as scraped data.
A fully successful live scrape remains dependent on the source allowing access.

## Original Django application (local only)


This Django app allows you to scrape property data and store it in a MongoDB database.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Python 3.x installed on your system.
- A MongoDB database or connection URI.
- Git installed on your system.

## Clone the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/tehami02/webscrapperDjango.git
```

Then,
```bash
pip install -r requirements-django.txt
```

## Configure other settings in the .env file, such as SECRET_KEY, DEBUG, and ALLOWED_HOSTS .
## Specially your SECRET_KEY , MONGODB_URI , DB_NAME and DRIVER_PATH as ChromeDriver runs for scrapping data.
   

```bash
python manage.py migrate
python manage.py runserver
```

## Open your web browser and go to http://127.0.0.1:8000/ to access the web scraper.


Enter a city name and click the "Scrape" button to retrieve property data. The scraped data will be stored in the MongoDB database.
Collection will be created automatically , just specify DB_NAME and MONGODB_URI correctly.

![Screenshot (341)](https://github.com/tehami02/webscrapperDjango/assets/93815993/7902d0c7-461e-4e62-935f-3c74f9442058)


## WAIT FOR 10 to 20 Seconds

You can also access the property list at http://127.0.0.1:8000/property_list/city-name/.

![Screenshot (310)](https://github.com/tehami02/webscrapperDjango/assets/93815993/eb5a4e3d-b155-496e-a99b-302cd587836f)


## MongoDB screenshot -
![Screenshot (561)](https://github.com/tehami02/webscrapperDjango/assets/93815993/3ab7356f-64fb-42e3-ae17-d77db5394225)


