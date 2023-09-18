import os
from langchain.document_loaders import UnstructuredMarkdownLoader
from slugify import slugify
from ..utils import guid, file_creation_time, write_to_server_documents, move_source
from ...utils import tokenize

# Process all text-related documents.
def as_markdown(**kwargs):
  parent_dir = kwargs.get('directory', 'hotdir')
  filename = kwargs.get('filename')
  ext = kwargs.get('ext', '.txt')
  remove = kwargs.get('remove_on_complete', False)
  fullpath = f"{parent_dir}/{filename}{ext}"

  loader = UnstructuredMarkdownLoader(fullpath)
  data = loader.load()[0]
  content = data.page_content

  if len(content) == 0:
    print(f"Resulting page content was empty - no text could be extracted from {filename}{ext}.")
    return(False, f"No text could be extracted from {filename}{ext}.")

  print(f"-- Working {fullpath} --")
  data = {
    'id': guid(),
    'url': "file://"+os.path.abspath(f"{parent_dir}/processed/{filename}{ext}"),
    'title':  f"{filename}", # TODO: find a better metadata
    'docAuthor': 'Unknown', # TODO: find a better metadata
    'description': 'Unknown', # TODO: find a better metadata
    'docSource': 'markdown file uploaded by the user.',
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
