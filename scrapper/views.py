# views.py
from django.shortcuts import render, redirect
from .models import ScrapedProperty
from .scraping_utils import scrape_page_data
from selenium import webdriver
from django.urls import reverse
from .utils import insert_data_into_mongodb
 

def scrape_properties(request):
    if request.method == 'POST':
        # Get the city from the form data submitted by the user
        city = request.POST.get('city')

        # Construct the URL based on the user's input
        url = f'https://www.99acres.com/search/property/buy/{city}?keyword={city}&preference=S&area_unit=1&res_com=R'
        
        # Call the scrape function to get the scraped data
        scraped_data = scrape_page_data(city,url)
         # Store the scraped data in the database
        insert_data_into_mongodb(scraped_data)
        for data in scraped_data:
            ScrapedProperty.objects.create(
                project_name=data['Project Name'],
                locality=data['Locality'],
                price_range=data['Price Range'],
                area=data['Area'],
                property_type=data['Type'],
                city=data['City'],
                url=data['URL']
            )

        return redirect(reverse('property_list', kwargs={'city': city}))  # Redirect to a page displaying the list of properties
    else:
        return render(request, 'scrape_properties.html')

def property_list(request, city):
    properties = ScrapedProperty.objects.filter(city=city)
    return render(request, 'property_list.html', {'properties': properties, 'city': city})


# Add views for managing Cron jobs, enabling/disabling, changing schedule, etc.
