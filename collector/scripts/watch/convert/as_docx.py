import os
from langchain.document_loaders import Docx2txtLoader, UnstructuredODTLoader
from slugify import slugify
from ..utils import guid, file_creation_time, write_to_server_documents, move_source
from ...utils import tokenize

# Process all text-related documents.
def as_docx(**kwargs):
  parent_dir = kwargs.get('directory', 'hotdir')
  filename = kwargs.get('filename')
  ext = kwargs.get('ext', '.txt')
  remove = kwargs.get('remove_on_complete', False)
  fullpath = f"{parent_dir}/{filename}{ext}"

  loader = Docx2txtLoader(fullpath)
  data = loader.load()[0]
  content = data.page_content

  if len(content) == 0:
    print(f"Resulting text content was empty for {filename}{ext}.")
    return(False, f"No text content found in {filename}{ext}")

  print(f"-- Working {fullpath} --")
  data = {
    'id': guid(),
    'url': "file://"+os.path.abspath(f"{parent_dir}/processed/{filename}{ext}"),
    'title': f"{filename}{ext}",
    'docAuthor': 'Unknown', # TODO: Find a better author
    'description': 'Unknown', # TODO: Find a better bescription
    'docSource': 'Docx Text file uploaded by the user.',
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

def as_odt(**kwargs):
  parent_dir = kwargs.get('directory', 'hotdir')
  filename = kwargs.get('filename')
  ext = kwargs.get('ext', '.txt')
  remove = kwargs.get('remove_on_complete', False)
  fullpath = f"{parent_dir}/{filename}{ext}"

  loader = UnstructuredODTLoader(fullpath)
  data = loader.load()[0]
  content = data.page_content

  if len(content) == 0:
    print(f"Resulting text content was empty for {filename}{ext}.")
    return(False, f"No text content found in {filename}{ext}")

  print(f"-- Working {fullpath} --")
  data = {
    'id': guid(),
    'url': "file://"+os.path.abspath(f"{parent_dir}/processed/{filename}{ext}"),
    'title': f"{filename}{ext}",
    'author': 'Unknown', # TODO: Find a better author
    'description': 'Unknown', # TODO: Find a better bescription
    'docSource': 'ODT Text file uploaded by the user.',
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