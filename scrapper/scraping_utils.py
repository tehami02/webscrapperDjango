# scraping_utils.py
from bs4 import BeautifulSoup
from selenium import webdriver
import time  # Import the time module for adding delays


def scrape_page_data(city,url):
    # Specify the path to the ChromeDriver executable
    chrome_driver_path = 'C:/Users/teham/Desktop/NewPro/property/chromedriver'
    driver = webdriver.Chrome(executable_path=chrome_driver_path)
    driver.get(url)
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')
    
    property_listings = soup.find_all('div', class_='projectTuple__cardWrap')
    
    # Create a list to store the scraped data as dictionaries
    property_data_list = []
    
    # Iterate through each property listing
    for listing_details in property_listings:
        # Your scraping logic here to extract project details
        # Find Project Name and URL
        project_name_element = listing_details.find('a', class_='projectTuple__projectName projectTuple__pdWrap20 ellipsis')
        project_url = project_name_element['href'] if project_name_element else None
        project_name = project_name_element.get_text() if project_name_element else None

        # Find Type
        type_element = listing_details.find('h2', class_='projectTuple__subHeadingWrap body_med ellipsis')
        project_type = type_element.get_text() if type_element else None

        # Find Price Range
        price_element = listing_details.find('span', class_='list_header_bold configurationCards__srpPriceHeading configurationCards__configurationCardsHeading')
        price_range = price_element.get_text().strip() if price_element else None

        # Find Location
        location_element = listing_details.find('h2', class_='projectTuple__subHeadingWrap body_med ellipsis')
        location = location_element.get_text().strip() if location_element else None

        # Find Price Range
        area_element = listing_details.find('span', class_='caption_subdued_medium configurationCards__cardAreaSubHeadingOne')
        area_range = area_element.get_text().strip() if price_element else None
        
        # Find Room Configuration (e.g., 3 BHK, 4 BHK)
        room_elements = listing_details.find_all('span', class_='list_header_semiBold configurationCards__configBandLabel')
        rooms = ', '.join([room.get_text().strip() for room in room_elements]) if room_elements else None

        # Extract the last word from the "Type" attribute and move it to "City"
        type_words = project_type.split()
        if type_words:
            city2 = city
            project_type = ' '.join(type_words[:-1])
        else:
            city2 = None
        # Create a dictionary for the current property listing and add it to the list
        property_data_list.append({
            'Project Name': project_name,
            'Locality': project_type,
            'Price Range': price_range,
            'Location': location,
            'Area' : area_range,
            'Type' : rooms,
            'City' : city,
            'URL': project_url
        })
    
    driver.quit()  # Quit the WebDriver
    return property_data_list
