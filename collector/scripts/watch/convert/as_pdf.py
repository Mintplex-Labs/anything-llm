import os
from langchain.document_loaders import PyPDFLoader
from slugify import slugify
from ..utils import guid, file_creation_time, write_to_server_documents, move_source
from ...utils import tokenize

# Process all text-related documents.
def as_pdf(**kwargs):
  parent_dir = kwargs.get('directory', 'hotdir')
  filename = kwargs.get('filename')
  ext = kwargs.get('ext', '.txt')
  fullpath = f"{parent_dir}/{filename}{ext}"

  loader = PyPDFLoader(fullpath)
  pages = loader.load_and_split()

  print(f"-- Working {fullpath} --")
  for page in pages:
    pg_num = page.metadata.get('page')
    print(f"-- Working page {pg_num} --")

    content = page.page_content
    data = {
      'id': guid(), 
      'url': "file://"+os.path.abspath(f"{parent_dir}/processed/{filename}{ext}"),
      'title': f"{filename}_pg{pg_num}{ext}",
      'description': "a custom file uploaded by the user.",
      'published': file_creation_time(fullpath),
      'wordCount': len(content),
      'pageContent': content,
      'token_count_estimate': len(tokenize(content))
    }
    write_to_server_documents(data, f"{slugify(filename)}-pg{pg_num}-{data.get('id')}")

  move_source(parent_dir, f"{filename}{ext}")
  print(f"[SUCCESS]: {filename}{ext} converted & ready for embedding.\n")