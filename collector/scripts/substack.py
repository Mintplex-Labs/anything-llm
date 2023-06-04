import os, json
from urllib.parse import urlparse
from .utils import tokenize, ada_v2_cost
from .substack_utils import fetch_all_publications, only_valid_publications, get_content, append_meta
from alive_progress import alive_it

# Example substack URL: https://swyx.substack.com/
def substack():
  author_url = input("Enter the substack URL of the author you want to collect: ")
  if(author_url == ''):
    print("Not a valid author.substack.com URL")
    exit(1)
  
  source = urlparse(author_url)
  if('substack.com' not in source.netloc or len(source.netloc.split('.')) != 3):
    print("This does not appear to be a valid author.substack.com URL")
    exit(1)
  
  subdomain = source.netloc.split('.')[0]
  publications = fetch_all_publications(subdomain)
  valid_publications = only_valid_publications(publications)

  if(len(valid_publications)==0):
    print("There are no public or free preview newsletters by this creator - nothing to collect.")
    exit(1)

  print(f"{len(valid_publications)} of {len(publications)} publications are readable publically text posts - collecting those.")
  
  totalTokenCount = 0
  transaction_output_dir = f"../server/documents/substack-{subdomain}"
  if os.path.isdir(transaction_output_dir) == False:
    os.makedirs(transaction_output_dir)

  for publication in alive_it(valid_publications):
    pub_file_path = transaction_output_dir + f"/publication-{publication.get('id')}.json"
    if os.path.exists(pub_file_path) == True: continue

    full_text = get_content(publication.get('canonical_url'))
    if full_text is None or len(full_text) == 0: continue

    full_text = append_meta(publication, full_text)
    item = {
      'id': publication.get('id'),
      'url': publication.get('canonical_url'),
      'thumbnail': publication.get('cover_image'),
      'title': publication.get('title'),
      'subtitle': publication.get('subtitle'),
      'description': publication.get('description'),
      'published': publication.get('post_date'),
      'wordCount': publication.get('wordcount'),
      'pageContent': full_text,
    }

    tokenCount = len(tokenize(full_text))
    item['token_count_estimate'] = tokenCount

    totalTokenCount += tokenCount
    with open(pub_file_path, 'w', encoding='utf-8') as file:
      json.dump(item, file, ensure_ascii=True, indent=4)

  print(f"[Success]: {len(valid_publications)} scraped and fetched!")
  print(f"\n\n////////////////////////////")
  print(f"Your estimated cost to embed all of this data using OpenAI's text-embedding-ada-002 model at $0.0004 / 1K tokens will cost {ada_v2_cost(totalTokenCount)} using {totalTokenCount} tokens.")
  print(f"////////////////////////////\n\n")
  exit(0)




  
   






  