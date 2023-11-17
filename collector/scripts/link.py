import os, json, tempfile
from urllib.parse import urlparse
from requests_html import HTMLSession
from langchain.document_loaders import UnstructuredHTMLLoader
from .link_utils import append_meta, AsyncHTMLSessionFixed
from .utils import tokenize, ada_v2_cost
import requests
from bs4 import BeautifulSoup

# Example Channel URL https://tim.blog/2022/08/09/nft-insider-trading-policy/
def link():
  totalTokens = 0
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
    totalTokens += len(tokenize(full_text))
    source = urlparse(req.url)
    output_filename = f"website-{source.netloc}-{source.path.replace('/','_')}.json"
    output_path = f"./outputs/website-logs"

    transaction_output_filename = f"website-{source.path.replace('/','_')}.json"
    transaction_output_dir = f"../server/storage/documents/custom-documents"

    if os.path.isdir(output_path) == False:
      os.makedirs(output_path)

    if os.path.isdir(transaction_output_dir) == False:
      os.makedirs(transaction_output_dir)

    full_text = append_meta(req, full_text)
    with open(f"{output_path}/{output_filename}", 'w', encoding='utf-8') as file:
      json.dump(link, file, ensure_ascii=True, indent=4)

    with open(f"{transaction_output_dir}/{transaction_output_filename}", 'w', encoding='utf-8') as file:
      json.dump(link, file, ensure_ascii=True, indent=4)
  else:
    print("Could not parse any meaningful data from this link or url.")
    exit(1)

  print(f"\n\n[Success]: article or link content fetched!")
  print(f"////////////////////////////")
  print(f"Your estimated cost to embed this data using OpenAI's text-embedding-ada-002 model at $0.0004 / 1K tokens will cost {ada_v2_cost(totalTokens)} using {totalTokens} tokens.")
  print(f"////////////////////////////")
  exit(0)

async def process_single_link(url):
    session = None
    try:
        print(f"Working on {url}...")
        session = AsyncHTMLSessionFixed()
        req = await session.get(url)
        await req.html.arender()
        await session.close()

        if not req.ok:
            return False, "Could not reach this URL."

        full_text = None
        with tempfile.NamedTemporaryFile(mode = "w") as tmp:
          tmp.write(req.html.html)
          tmp.seek(0)
          loader = UnstructuredHTMLLoader(tmp.name)
          data = loader.load()[0]
          full_text = data.page_content
          print("full text 1: ", full_text)
          tmp.close()
          print(full_text)

        print("full text: ", full_text)


        if full_text:
            link_meta = append_meta(req, full_text, True)

            source = urlparse(req.url)
            transaction_output_dir = "../server/storage/documents/custom-documents"
            transaction_output_filename = f"website-{source.netloc}-{source.path.replace('/', '_')}.json"

            if not os.path.isdir(transaction_output_dir):
                os.makedirs(transaction_output_dir)

            file_path = os.path.join(transaction_output_dir, transaction_output_filename)
            with open(file_path, 'w', encoding='utf-8') as file:
                json.dump(link_meta, file, ensure_ascii=False, indent=4)


            return True, "Content fetched and saved."

        else:
            return False, "Could not parse any meaningful data from this URL."

    except Exception as e:
        if session is not None:
           session.close() # Kill hanging session.
        return False, str(e)

def crawler():
  prompt = "Paste in root URI of the pages of interest: "
  new_link = input(prompt)
  filter_value = input("Add a filter value for the url to ensure links don't wander too far. eg: 'my-domain.com': ")
  #extract this from the uri provided
  root_site = urlparse(new_link).scheme + "://" + urlparse(new_link).hostname
  links = []
  urls = new_link
  links.append(new_link)
  grab = requests.get(urls)
  soup = BeautifulSoup(grab.text, 'html.parser')

  # traverse paragraphs from soup
  for link in soup.find_all("a"):
    data = link.get('href')
    if (data is not None):
      fullpath = data if data[0] != '/' else f"{root_site}{data}"
      try:
        destination = urlparse(fullpath).scheme + "://" + urlparse(fullpath).hostname + (urlparse(fullpath).path if urlparse(fullpath).path is not None else '')
        if filter_value in destination:
          data = destination.strip()
          print (data)
          links.append(data)
        else:
          print (data + " does not apply for linking...")
      except:
        print (data + " does not apply for linking...")
  #parse the links found
  parse_links(links)

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

  parse_links(links)


# parse links from array
def parse_links(links):
    totalTokens = 0
    for link in links:
        print(f"Working on {link}...")
        session = HTMLSession()

        req = session.get(link, timeout=20)

        if not req.ok:
            print(f"Could not reach {link} - skipping!")
            continue

        req.html.render(timeout=10)

        full_text = None
        with tempfile.NamedTemporaryFile(mode="w") as tmp:
            tmp.write(req.html.html)
            tmp.seek(0)
            loader = UnstructuredHTMLLoader(tmp.name)
            data = loader.load()[0]
            full_text = data.page_content
            tmp.close()

        link = append_meta(req, full_text, True)
        if len(full_text) > 0:
            source = urlparse(req.url)
            output_filename = f"website-{source.netloc}-{source.path.replace('/','_')}.json"
            output_path = f"./outputs/website-logs"

            transaction_output_filename = f"website-{source.path.replace('/','_')}.json"
            transaction_output_dir = f"../server/storage/documents/custom-documents"

            if not os.path.isdir(output_path):
                os.makedirs(output_path)

            if not os.path.isdir(transaction_output_dir):
                os.makedirs(transaction_output_dir)

            full_text = append_meta(req, full_text)
            tokenCount = len(tokenize(full_text))
            totalTokens += tokenCount

            with open(f"{output_path}/{output_filename}", 'w', encoding='utf-8') as file:
                json.dump(link, file, ensure_ascii=True, indent=4)

            with open(f"{transaction_output_dir}/{transaction_output_filename}", 'w', encoding='utf-8') as file:
                json.dump(link, file, ensure_ascii=True, indent=4)

            req.session.close()
        else:
            print(f"Could not parse any meaningful data from {link}.")
            continue

    print(f"\n\n[Success]: {len(links)} article or link contents fetched!")
    print(f"////////////////////////////")
    print(f"Your estimated cost to embed this data using OpenAI's text-embedding-ada-002 model at $0.0004 / 1K tokens will cost {ada_v2_cost(totalTokens)} using {totalTokens} tokens.")
    print(f"////////////////////////////")