import os
import datetime
import email.utils
import re
import quopri
import base64
from mailbox import mbox, mboxMessage
from slugify import slugify
from bs4 import BeautifulSoup
from scripts.watch.utils import (
    guid,
    file_creation_time,
    write_to_server_documents,
    move_source,
)
from scripts.utils import tokenize


def get_content(message: mboxMessage) -> str:
    content = "None"
    # if message.is_multipart():
    for part in message.walk():
        if part.get_content_type() == "text/plain":
            content = part.get_payload(decode=True)
            break
        elif part.get_content_type() == "text/html":
            soup = BeautifulSoup(part.get_payload(decode=True), "html.parser")
            content = soup.get_text()

    if isinstance(content, bytes):
        try:
            content = content.decode("utf-8")
        except UnicodeDecodeError:
            content = content.decode("latin-1")

    return content


def parse_subject(subject: str) -> str:
    # Check if subject is Quoted-Printable encoded
    if subject.startswith("=?") and subject.endswith("?="):
        # Extract character set and encoding information
        match = re.match(r"=\?(.+)\?(.)\?(.+)\?=", subject)
        if match:
            charset = match.group(1)
            encoding = match.group(2)
            encoded_text = match.group(3)
            is_quoted_printable = encoding.upper() == "Q"
            is_base64 = encoding.upper() == "B"
            if is_quoted_printable:
                # Decode Quoted-Printable encoded text
                subject = quopri.decodestring(encoded_text).decode(charset)
            elif is_base64:
                # Decode Base64 encoded text
                subject = base64.b64decode(encoded_text).decode(charset)

    return subject


# Process all mbox-related documents.
def as_mbox(**kwargs):
    parent_dir = kwargs.get("directory", "hotdir")
    filename = kwargs.get("filename")
    ext = kwargs.get("ext", ".mbox")
    remove = kwargs.get("remove_on_complete", False)

    if filename is not None:
        filename = str(filename)
    else:
        print("[ERROR]: No filename provided.")
        return (False, "No filename provided.")

    fullpath = f"{parent_dir}/{filename}{ext}"

    print(f"-- Working {fullpath} --")
    box = mbox(fullpath)

    for message in box:
        content = get_content(message)
        content = content.strip().replace("\r\n", "\n")

        if len(content) == 0:
            print("[WARNING]: Mail with no content. Ignored.")
            continue

        date_tuple = email.utils.parsedate_tz(message["Date"])
        if date_tuple:
            local_date = datetime.datetime.fromtimestamp(
                email.utils.mktime_tz(date_tuple)
            )
            date_sent = local_date.strftime("%a, %d %b %Y %H:%M:%S")
        else:
            date_sent = None

        subject = message["Subject"]

        if subject is None:
            print("[WARNING]: Mail with no subject. But has content.")
            subject = "None"
        else:
            subject = parse_subject(subject)

        abs_path = os.path.abspath(
            f"{parent_dir}/processed/{slugify(filename)}-{guid()}{ext}"
        )
        data = {
            "id": guid(),
            "url": f"file://{abs_path}",
            "title": subject,
            "docAuthor": message["From"],
            "description": f"email from {message['From']} to {message['To']}",
            "docSource": "mbox file uploaded by the user.",
            "chunkSource": subject,
            "published": file_creation_time(fullpath),
            "wordCount": len(content),
            "pageContent": content,
            "token_count_estimate": len(tokenize(content)),
        }

        write_to_server_documents(data, f"{slugify(filename)}-{data.get('id')}")

    move_source(parent_dir, f"{filename}{ext}", remove=remove)
    print(f"[SUCCESS]: {filename}{ext} converted & ready for embedding.\n")
    return (True, None)
