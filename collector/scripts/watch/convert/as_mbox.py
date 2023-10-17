import os
import datetime
import email.utils
from mailbox import mbox, mboxMessage
from slugify import slugify
from bs4 import BeautifulSoup
from scripts.watch.utils import guid, file_creation_time, write_to_server_documents, move_source
from scripts.utils import tokenize


def get_content(message: mboxMessage) -> str:
    content = "None"
    if message.is_multipart():
        for part in message.get_payload():
            if part.get_content_type() == "text/plain":
                content = part.get_payload(decode=True)
                break
            elif part.get_content_type() == "text/html":
                soup = BeautifulSoup(part.get_payload(decode=True), "html.parser")
                content = soup.get_text()
    else:
        content = message.get_payload(decode=True)
        if message.get_content_type() == "text/html":
            soup = BeautifulSoup(content, "html.parser")
            content = soup.get_text()

    if isinstance(content, bytes):
        content = content.decode()

    return content


# Process all mbox-related documents.
def as_mbox(**kwargs):
    parent_dir = kwargs.get("directory", "hotdir")
    filename = kwargs.get("filename")
    ext = kwargs.get("ext", ".mbox")
    remove = kwargs.get("remove_on_complete", False)
    fullpath = f"{parent_dir}/{filename}{ext}"

    print(f"-- Working {fullpath} --")
    box = mbox(fullpath)

    for message in box:
        content = get_content(message)
        content = content.strip().replace("\r\n", "\n")

        date_tuple = email.utils.parsedate_tz(message["Date"])
        if date_tuple:
            local_date = datetime.datetime.fromtimestamp(email.utils.mktime_tz(date_tuple))
            date_sent = local_date.strftime("%a, %d %b %Y %H:%M:%S")
        else:
            date_sent = None

        data = {
            "id": guid(),
            "url": "file://"
            + os.path.abspath(f"{parent_dir}/processed/{slugify(filename)}-{guid()}{ext}"),
            "title": message["Subject"],
            "docAuthor": message["From"],
            "description": f"email {message['From']} to {message['To']}",
            "docSource": "mbox file uploaded by the user.",
            "published": file_creation_time(fullpath),
            "sender": message["From"],
            "recipient": message["To"],
            "subject": message["Subject"],
            "date_sent": date_sent,
            "wordCount": len(content),
            "pageContent": content,
            "token_count_estimate": len(tokenize(content)),
        }

        write_to_server_documents(data, f"{slugify(filename)}-{data.get('id')}")

    move_source(parent_dir, f"{filename}{ext}", remove=remove)
    print(f"[SUCCESS]: {filename}{ext} converted & ready for embedding.\n")
    return (True, None)
