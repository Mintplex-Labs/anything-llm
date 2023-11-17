import os, json, requests, tempfile
from requests_html import HTMLSession
from langchain.document_loaders import UnstructuredHTMLLoader
from .watch.utils import guid

def fetch_all_publications(subdomain):
  file_path = f"./outputs/substack-logs/substack-{subdomain}.json"

  if os.path.isdir("./outputs/substack-logs") == False:
    os.makedirs("./outputs/substack-logs")

  if os.path.exists(file_path):
    with open(file_path, "r") as file:
      print(f"Returning cached data for substack {subdomain}.substack.com. If you do not wish to use stored data then delete the file for this newsletter to allow refetching.")
      return json.load(file)

  collecting = True
  offset = 0
  publications = []

  while collecting is True:
    url = f"https://{subdomain}.substack.com/api/v1/archive?sort=new&offset={offset}"
    response = requests.get(url)
    if(response.ok == False):
      print("Bad response - exiting collection")
      collecting = False
      continue

    data = response.json()

    if(len(data) ==0 ):
      collecting = False
      continue

    for publication in data:
      publications.append(publication)
    offset = len(publications)

  with open(file_path, 'w+', encoding='utf-8') as json_file:
    json.dump(publications, json_file, ensure_ascii=True, indent=2)
    print(f"{len(publications)} publications found for author {subdomain}.substack.com. Saved to substack-logs/channel-{subdomain}.json")

  return publications

def only_valid_publications(publications= []):
  valid_publications = []
  for publication in publications:
    is_paid = publication.get('audience') != 'everyone'
    if (is_paid and publication.get('should_send_free_preview') != True) or publication.get('type') != 'newsletter': continue
    valid_publications.append(publication)
  return valid_publications

def get_content(article_link):
  print(f"Fetching {article_link}")
  if(len(article_link) == 0):
    print("Invalid URL!")
    return None

  session = HTMLSession()
  req = session.get(article_link)
  if(req.ok == False):
    print("Could not reach this url!")
    return None

  req.html.render()

  full_text = None
  with tempfile.NamedTemporaryFile(mode = "w") as tmp:
    tmp.write(req.html.html)
    tmp.seek(0)
    loader = UnstructuredHTMLLoader(tmp.name)
    data = loader.load()[0]
    full_text = data.page_content
    tmp.close()
  return full_text

def append_meta(publication, text):
  meta = {
    'id': guid(),
    'url': publication.get('canonical_url'),
    'thumbnail': publication.get('cover_image'),
    'title': publication.get('title'),
    'subtitle': publication.get('subtitle'),
    'description': publication.get('description'),
    'createdAt': publication.get('post_date'),
    'wordCount': publication.get('wordcount')
  }
  return "Newsletter Metadata:\n"+json.dumps(meta)+"\n\nArticle Content:\n" + text