import os, json
from langchain.document_loaders import GitbookLoader
from urllib.parse import urlparse
from datetime import datetime
from alive_progress import alive_it
from .utils import tokenize
from uuid import uuid4

def gitbook():
  url = input("Enter the URL of the GitBook you want to collect: ")
  if(url == ''):
    print("Not a gitbook URL")
    exit(1)

  primary_source = urlparse(url)
  output_path = f"./outputs/gitbook-logs/{primary_source.netloc}"
  transaction_output_dir = f"../server/documents/gitbook-{primary_source.netloc}"

  if os.path.exists(output_path) == False:os.makedirs(output_path)
  if os.path.exists(transaction_output_dir) == False: os.makedirs(transaction_output_dir)
  loader = GitbookLoader(url, load_all_paths= primary_source.path in ['','/'])
  for doc in alive_it(loader.load()):
    metadata = doc.metadata
    content = doc.page_content
    source = urlparse(metadata.get('source'))
    name = 'home' if source.path in ['','/'] else source.path.replace('/','_')
    output_filename = f"doc-{name}.json"
    transaction_output_filename = f"doc-{name}.json"
    data = {
      'id': str(uuid4()),
      'url': metadata.get('source'),
      "title": metadata.get('title'),
      "description": metadata.get('title'),
      "published": datetime.today().strftime('%Y-%m-%d %H:%M:%S'),
      "wordCount": len(content),
      'pageContent': content,
      'token_count_estimate': len(tokenize(content))
    }

    with open(f"{output_path}/{output_filename}", 'w', encoding='utf-8') as file:
      json.dump(data, file, ensure_ascii=True, indent=4)

    with open(f"{transaction_output_dir}/{transaction_output_filename}", 'w', encoding='utf-8') as file:
      json.dump(data, file, ensure_ascii=True, indent=4)
