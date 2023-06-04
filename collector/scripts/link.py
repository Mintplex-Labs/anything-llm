import os, json, tempfile
from urllib.parse import urlparse
from requests_html import HTMLSession
from langchain.document_loaders import UnstructuredHTMLLoader
from .link_utils import  append_meta
from .utils import tokenize, ada_v2_cost
    
# Example Channel URL https://tim.blog/2022/08/09/nft-insider-trading-policy/
def link():
  print("[NOTICE]: The first time running this process it will download supporting libraries.\n\n")
  fqdn_link = input("Paste in the URL of an online article or blog: ")
  if(len(fqdn_link) == 0):
    print("Invalid URL!")
    exit(1)

  session = HTMLSession()
  req = session.get(fqdn_link)
  if(req.ok == False):
    print("Could not reach this url!")
    exit(1)
  
  req.html.render()
  full_text = None
  with tempfile.NamedTemporaryFile(mode = "w") as tmp:
    tmp.write(req.html.html)
    tmp.seek(0)
    loader = UnstructuredHTMLLoader(tmp.name)
    data = loader.load()[0]
    full_text = data.page_content
    tmp.close()
  
  link = append_meta(req, full_text, True)
  if(len(full_text) > 0):
    source = urlparse(req.url)
    output_filename = f"website-{source.netloc}-{source.path.replace('/','_')}.json"
    output_path = f"./outputs/website-logs"

    transaction_output_filename = f"article-{source.path.replace('/','_')}.json"
    transaction_output_dir = f"../server/documents/website-{source.netloc}"

    if os.path.isdir(output_path) == False:
      os.makedirs(output_path)

    if os.path.isdir(transaction_output_dir) == False:
      os.makedirs(transaction_output_dir)

    full_text = append_meta(req, full_text)
    tokenCount = len(tokenize(full_text))
    link['pageContent'] = full_text
    link['token_count_estimate'] = tokenCount

    with open(f"{output_path}/{output_filename}", 'w', encoding='utf-8') as file:
      json.dump(link, file, ensure_ascii=True, indent=4)

    with open(f"{transaction_output_dir}/{transaction_output_filename}", 'w', encoding='utf-8') as file:
      json.dump(link, file, ensure_ascii=True, indent=4)
  else:
    print("Could not parse any meaningful data from this link or url.")
    exit(1)

  print(f"\n\n[Success]: article or link content fetched!")
  print(f"////////////////////////////")
  print(f"Your estimated cost to embed this data using OpenAI's text-embedding-ada-002 model at $0.0004 / 1K tokens will cost {ada_v2_cost(tokenCount)} using {tokenCount} tokens.")
  print(f"////////////////////////////")
  exit(0)

def links():
  links = []
  prompt = "Paste in the URL of an online article or blog: "
  done = False
  
  while(done == False):
    new_link = input(prompt)
    if(len(new_link) == 0): 
      done = True
      links = [*set(links)]
      continue

    links.append(new_link)
    prompt = f"\n{len(links)} links in queue. Submit an empty value when done pasting in links to execute collection.\nPaste in the next URL of an online article or blog: "

  if(len(links) == 0):
    print("No valid links provided!")
    exit(1)

  totalTokens = 0
  for link in links:
    print(f"Working on {link}...")
    session = HTMLSession()
    req = session.get(link)
    if(req.ok == False):
      print(f"Could not reach {link} - skipping!")
      continue
    
    req.html.render()
    full_text = None
    with tempfile.NamedTemporaryFile(mode = "w") as tmp:
      tmp.write(req.html.html)
      tmp.seek(0)
      loader = UnstructuredHTMLLoader(tmp.name)
      data = loader.load()[0]
      full_text = data.page_content
      tmp.close()
  
    link = append_meta(req, full_text, True)
    if(len(full_text) > 0):
      source = urlparse(req.url)
      output_filename = f"website-{source.netloc}-{source.path.replace('/','_')}.json"
      output_path = f"./outputs/website-logs"

      transaction_output_filename = f"article-{source.path.replace('/','_')}.json"
      transaction_output_dir = f"../server/documents/website-{source.netloc}"

      if os.path.isdir(output_path) == False:
        os.makedirs(output_path)

      if os.path.isdir(transaction_output_dir) == False:
        os.makedirs(transaction_output_dir)

      full_text = append_meta(req, full_text)
      tokenCount = len(tokenize(full_text))
      link['pageContent'] = full_text
      link['token_count_estimate'] = tokenCount
      totalTokens += tokenCount

      with open(f"{output_path}/{output_filename}", 'w', encoding='utf-8') as file:
        json.dump(link, file, ensure_ascii=True, indent=4)

      with open(f"{transaction_output_dir}/{transaction_output_filename}", 'w', encoding='utf-8') as file:
        json.dump(link, file, ensure_ascii=True, indent=4)
    else:
      print(f"Could not parse any meaningful data from {link}.")
      continue

  print(f"\n\n[Success]: {len(links)} article or link contents fetched!")
  print(f"////////////////////////////")
  print(f"Your estimated cost to embed this data using OpenAI's text-embedding-ada-002 model at $0.0004 / 1K tokens will cost {ada_v2_cost(totalTokens)} using {totalTokens} tokens.")
  print(f"////////////////////////////")
  exit(0)