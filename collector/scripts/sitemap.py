import requests
import xml.etree.ElementTree as ET
from scripts.link import parse_links

def parse_sitemap(url):
    response = requests.get(url)
    root = ET.fromstring(response.content)
    
    urls = []
    for element in root.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}url'):
        for loc in element.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
            urls.append(loc.text)
    
    return urls

# Example sitemap URL https://www.nerdwallet.com/blog/wp-sitemap-news-articles-1.xml
def sitemap():
    sitemap_url = input("Enter the URL of the sitemap: ")
    
    if(len(sitemap_url) == 0):
        print("No valid sitemap provided!")
        exit(1)

    url_array = parse_sitemap(sitemap_url)

    #parse links from array
    parse_links(url_array)
