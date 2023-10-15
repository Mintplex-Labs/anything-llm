import os, json, tempfile
from urllib.parse import urlparse
from requests_html import HTMLSession
from langchain.document_loaders import UnstructuredHTMLLoader
import requests
from bs4 import BeautifulSoup
from .link_utils import append_meta
from .utils import tokenize, ada_v2_cost


# Example Channel URL https://tim.blog/2022/08/09/nft-insider-trading-policy/
def link():
    print(
        "[NOTICE]: The first time running this process it will download supporting libraries.\n\n"
    )
    fqdn_link = input("Paste in the URL of an online article or blog: ")
    if len(fqdn_link) == 0:
        print("Invalid URL!")
        exit(1)

    session = HTMLSession()
    req = session.get(fqdn_link)
    if req.ok is False:
        print("Could not reach this url!")
        exit(1)

    req.html.render()
    full_text = None
    with tempfile.NamedTemporaryFile(mode="w") as tmp:
        tmp.write(req.html.html)
        tmp.seek(0)
        loader = UnstructuredHTMLLoader(tmp.name)
        data = loader.load()[0]
        full_text = data.page_content
        tmp.close()

    the_link = append_meta(req, full_text, True)
    if len(full_text) > 0:
        source = urlparse(req.url)
        output_filename = f"website-{source.netloc}-{source.path.replace('/','_')}.json"
        output_path = "./outputs/website-logs"

        transaction_output_filename = f"article-{source.path.replace('/','_')}.json"
        transaction_output_dir = f"../server/storage/documents/website-{source.netloc}"

        if not os.path.isdir(output_path):
            os.makedirs(output_path)

        if not os.path.isdir(transaction_output_dir):
            os.makedirs(transaction_output_dir)

        full_text = append_meta(req, full_text)
        token_count = len(tokenize(full_text))
        the_link["pageContent"] = full_text
        the_link["token_count_estimate"] = token_count

        with open(f"{output_path}/{output_filename}", "w", encoding="utf-8") as file:
            json.dump(the_link, file, ensure_ascii=True, indent=4)

        with open(
            f"{transaction_output_dir}/{transaction_output_filename}", "w", encoding="utf-8"
        ) as file:
            json.dump(the_link, file, ensure_ascii=True, indent=4)
    else:
        print("Could not parse any meaningful data from this link or url.")
        exit(1)

    print("\n\n[Success]: article or link content fetched!")
    print("////////////////////////////")
    print(
        f"Your estimated cost to embed this data using OpenAI's "
        f"text-embedding-ada-002 model at $0.0004 / 1K tokens will "
        f"cost {ada_v2_cost(token_count)} using {token_count} tokens."
    )
    print("////////////////////////////")
    exit(0)


def crawler():
    prompt = "Paste in root URI of the pages of interest: "
    new_link = input(prompt)
    filter_value = input(
        "Add a filter value for the url to ensure links don't wander too far. eg: 'my-domain.com': "
    )
    # extract this from the uri provided
    root_site = urlparse(new_link).scheme + "://" + urlparse(new_link).hostname
    links_list = []
    urls = new_link
    links_list.append(new_link)
    grab = requests.get(urls, timeout=10)
    soup = BeautifulSoup(grab.text, "html.parser")

    # traverse paragraphs from soup
    for this_link in soup.find_all("a"):
        data = this_link.get("href")
        if data is not None:
            fullpath = data if data[0] != "/" else f"{root_site}{data}"
            # pylint: disable=broad-exception-caught,bare-except
            try:
                destination = (
                    urlparse(fullpath).scheme
                    + "://"
                    + urlparse(fullpath).hostname
                    + (urlparse(fullpath).path if urlparse(fullpath).path is not None else "")
                )
                if filter_value in destination:
                    data = destination.strip()
                    print(data)
                    links_list.append(data)
                else:
                    print(data + " does not apply for linking...")
            except:
                print(data + " does not apply for linking...")
    # parse the links found
    parse_links(links_list)


def links():
    the_links = []
    prompt = "Paste in the URL of an online article or blog: "
    done = False

    while not done:
        new_link = input(prompt)
        if len(new_link) == 0:
            done = True
            the_links = [*set(the_links)]
            continue

        the_links.append(new_link)
        prompt = (
            f"\n{len(the_links)} links in queue. Submit an empty value when done pasting in "
            f"links to execute collection.\nPaste in the next URL of an online article or blog: "
        )

    if len(the_links) == 0:
        print("No valid links provided!")
        exit(1)

    parse_links(the_links)


# parse links from array
def parse_links(links_list):
    total_tokens = 0
    for the_link in links_list:
        print(f"Working on {the_link}...")
        session = HTMLSession()

        req = session.get(the_link, timeout=20)

        if not req.ok:
            print(f"Could not reach {the_link} - skipping!")
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

        the_link = append_meta(req, full_text, True)
        if len(full_text) > 0:
            source = urlparse(req.url)
            output_filename = f"website-{source.netloc}-{source.path.replace('/','_')}.json"
            output_path = "./outputs/website-logs"

            transaction_output_filename = f"article-{source.path.replace('/','_')}.json"
            transaction_output_dir = f"../server/storage/documents/website-{source.netloc}"

            if not os.path.isdir(output_path):
                os.makedirs(output_path)

            if not os.path.isdir(transaction_output_dir):
                os.makedirs(transaction_output_dir)

            full_text = append_meta(req, full_text)
            token_count = len(tokenize(full_text))
            the_link["pageContent"] = full_text
            the_link["token_count_estimate"] = token_count
            total_tokens += token_count

            with open(f"{output_path}/{output_filename}", "w", encoding="utf-8") as file:
                json.dump(the_link, file, ensure_ascii=True, indent=4)

            with open(
                f"{transaction_output_dir}/{transaction_output_filename}", "w", encoding="utf-8"
            ) as file:
                json.dump(the_link, file, ensure_ascii=True, indent=4)

            req.session.close()
        else:
            print(f"Could not parse any meaningful data from {the_link}.")
            continue

    print(f"\n\n[Success]: {len(links_list)} article or link contents fetched!")
    print("////////////////////////////")
    print(
        f"Your estimated cost to embed this data using OpenAI's text-embedding-ada-002 model "
        f"at $0.0004 / 1K tokens will cost {ada_v2_cost(total_tokens)} using {total_tokens} tokens."
    )
    print("////////////////////////////")
