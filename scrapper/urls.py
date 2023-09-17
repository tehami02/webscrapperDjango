from django.urls import path
from . import views

urlpatterns = [
    # ... Other URL patterns ...

    # URL pattern for scraping properties
    path('scrape/', views.scrape_properties, name='scrape_properties'),

    # URL pattern for listing properties by city
    path('property_list/<str:city>/', views.property_list, name='property_list'),
]
