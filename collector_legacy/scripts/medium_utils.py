import os, json, requests, re
from bs4 import BeautifulSoup

def get_username(author_url):
  if '@' in author_url:
    pattern = r"medium\.com/@([\w-]+)"
    match = re.search(pattern, author_url)
    return match.group(1) if match else None 
  else:
    # Given subdomain
    pattern = r"([\w-]+).medium\.com"
    match = re.search(pattern, author_url)
    return match.group(1) if match else None 

def get_docid(medium_docpath):
  pattern = r"medium\.com/p/([\w-]+)"
  match = re.search(pattern, medium_docpath)
  return match.group(1) if match else None 

def fetch_recent_publications(handle):
  rss_link = f"https://medium.com/feed/@{handle}"
  response = requests.get(rss_link)
  if(response.ok == False):
    print(f"Could not fetch RSS results for author.")
    return []
  
  xml = response.content
  soup = BeautifulSoup(xml, 'xml')
  items = soup.find_all('item')
  publications = []

  if os.path.isdir("./outputs/medium-logs") == False:
      os.makedirs("./outputs/medium-logs")

  file_path = f"./outputs/medium-logs/medium-{handle}.json"

  if os.path.exists(file_path):
    with open(file_path, "r") as file:
      print(f"Returning cached data for Author {handle}. If you do not wish to use stored data then delete the file for this author to allow refetching.")
      return json.load(file)

  for item in items:
    tags = []
    for tag in item.find_all('category'): tags.append(tag.text)
    content = BeautifulSoup(item.find('content:encoded').text, 'html.parser')
    data = {
      'id': get_docid(item.find('guid').text),
      'title': item.find('title').text,
      'url': item.find('link').text.split('?')[0],
      'tags': ','.join(tags),
      'published': item.find('pubDate').text,
      'pageContent': content.get_text()
    }
    publications.append(data)
  
  with open(file_path, 'w+', encoding='utf-8') as json_file:
    json.dump(publications, json_file, ensure_ascii=True, indent=2)
    print(f"{len(publications)} articles found for author medium.com/@{handle}. Saved to medium-logs/medium-{handle}.json")

  return publications

def append_meta(publication, text):
  meta = {
    'url': publication.get('url'),
    'tags': publication.get('tags'),
    'title': publication.get('title'),
    'createdAt': publication.get('published'),
    'wordCount': len(text.split(' '))
  }
  return "Article Metadata:\n"+json.dumps(meta)+"\n\nArticle Content:\n" + text

