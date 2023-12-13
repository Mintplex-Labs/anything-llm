import os, json
from urllib.parse import urlparse
from .utils import tokenize, ada_v2_cost
from .medium_utils import get_username, fetch_recent_publications, append_meta
from alive_progress import alive_it

# Example medium URL: https://medium.com/@yujiangtham or https://davidall.medium.com
def medium():
  print("[NOTICE]: This method will only get the 10 most recent publishings.")
  author_url = input("Enter the medium URL of the author you want to collect: ")
  if(author_url == ''):
    print("Not a valid medium.com/@author URL")
    exit(1)
  
  handle = get_username(author_url)
  if(handle is None):
    print("This does not appear to be a valid medium.com/@author URL")
    exit(1)
  
  publications = fetch_recent_publications(handle)
  if(len(publications)==0):
    print("There are no public or free publications by this creator - nothing to collect.")
    exit(1)

  totalTokenCount = 0
  transaction_output_dir = f"../server/storage/documents/medium-{handle}"
  if os.path.isdir(transaction_output_dir) == False:
    os.makedirs(transaction_output_dir)

  for publication in alive_it(publications):
    pub_file_path = transaction_output_dir + f"/publication-{publication.get('id')}.json"
    if os.path.exists(pub_file_path) == True: continue

    full_text = publication.get('pageContent')
    if full_text is None or len(full_text) == 0: continue

    full_text = append_meta(publication, full_text)
    item = {
      'id': publication.get('id'),
      'url': publication.get('url'),
      'title': publication.get('title'),
      'published': publication.get('published'),
      'wordCount': len(full_text.split(' ')),
      'pageContent': full_text,
    }

    tokenCount = len(tokenize(full_text))
    item['token_count_estimate'] = tokenCount

    totalTokenCount += tokenCount
    with open(pub_file_path, 'w', encoding='utf-8') as file:
      json.dump(item, file, ensure_ascii=True, indent=4)

  print(f"[Success]: {len(publications)} scraped and fetched!")
  print(f"\n\n////////////////////////////")
  print(f"Your estimated cost to embed all of this data using OpenAI's text-embedding-ada-002 model at $0.0004 / 1K tokens will cost {ada_v2_cost(totalTokenCount)} using {totalTokenCount} tokens.")
  print(f"////////////////////////////\n\n")
  exit(0)




  
   






  