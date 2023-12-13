import os, re
from slugify import slugify
from langchain.document_loaders import BSHTMLLoader
from ..utils import guid, file_creation_time, write_to_server_documents, move_source
from ...utils import tokenize

# Process all html-related documents.
def as_html(**kwargs):
  parent_dir = kwargs.get('directory', 'hotdir')
  filename = kwargs.get('filename')
  ext = kwargs.get('ext', '.html')
  remove = kwargs.get('remove_on_complete', False)
  fullpath = f"{parent_dir}/{filename}{ext}"

  loader = BSHTMLLoader(fullpath)
  document = loader.load()[0]
  content = re.sub(r"\n+", "\n", document.page_content)

  if len(content) == 0:
    print(f"Resulting text content was empty for {filename}{ext}.")
    return(False, f"No text content found in {filename}{ext}")

  print(f"-- Working {fullpath} --")
  data = {
    'id': guid(),
    'url': "file://"+os.path.abspath(f"{parent_dir}/processed/{filename}{ext}"),
    'title':  document.metadata.get('title', f"{filename}{ext}"),
    'docAuthor': 'Unknown', # TODO: Find a better author
    'description': 'Unknown', # TODO: Find a better description
    'docSource': 'an HTML file uploaded by the user.',
    'chunkSource': f"{filename}{ext}",
    'published': file_creation_time(fullpath),
    'wordCount': len(content),
    'pageContent': content,
    'token_count_estimate': len(tokenize(content))
  }

  write_to_server_documents(data, f"{slugify(filename)}-{data.get('id')}")
  move_source(parent_dir, f"{filename}{ext}", remove=remove)

  print(f"[SUCCESS]: {filename}{ext} converted & ready for embedding.\n")
  return(True, None)
