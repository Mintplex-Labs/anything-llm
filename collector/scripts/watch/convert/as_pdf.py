import os, time, fitz
from langchain.document_loaders import PyMuPDFLoader # better UTF support and metadata
from langchain.text_splitter import RecursiveCharacterTextSplitter, TextSplitter
from slugify import slugify
from ..utils import guid, file_creation_time, write_to_server_documents, move_source
from ...utils import tokenize



# Process all text-related documents.
def as_pdf(**kwargs):
  parent_dir = kwargs.get('directory', 'hotdir')
  filename = kwargs.get('filename')
  ext = kwargs.get('ext', '.txt')
  remove = kwargs.get('remove_on_complete', False)
  fullpath = f"{parent_dir}/{filename}{ext}"
  destination = f"../server/storage/documents/{slugify(filename)}-{int(time.time())}"

  loader = PyMuPDFLoader(fullpath)

  # Custom flags for PyMuPDFLoader. https://pymupdf.readthedocs.io/en/latest/app1.html#text-extraction-flags-defaults
  mu_flags = (fitz.TEXT_PRESERVE_WHITESPACE
              | fitz.TEXT_PRESERVE_LIGATURES
              | fitz.TEXT_MEDIABOX_CLIP
              | fitz.TEXT_DEHYPHENATE) & ~fitz.TEXT_PRESERVE_SPANS & ~fitz.TEXT_PRESERVE_IMAGES

  pages = loader.load(flags=mu_flags)

  # The only thing PyMuPDFLoader does not have a flag it for removing all line breaks.
  # comparing with PyPDF, to acchieve the same result, we need to do add space where there is '\n\s' and remove double spaces

  # Best so fot, replace didn't understood '\n\s' so we need to do it in two steps
  for page in pages:
    page.page_content = page.page_content.replace("\n ", " ").replace("  ", " ")

  text_splitter: TextSplitter = RecursiveCharacterTextSplitter()
  pages = text_splitter.split_documents(pages)


  print(f"-- Working {fullpath} --")
  for page in pages:
    pg_num = page.metadata.get('page')
    print(f"-- Working page {pg_num} --")

    content = page.page_content
    title = page.metadata.get('title')
    author = page.metadata.get('author')
    subject = page.metadata.get('subject')

    data = {
      'id': guid(),
      'url': "file://"+os.path.abspath(f"{parent_dir}/processed/{filename}{ext}"),
      'title': title if title else 'Untitled',
      'author': author if author else 'Unknown',
      'description': subject if subject else 'Unknown',
      'document_source': 'pdf file uploaded by the user.',
      'chunk_source': f"{filename}_pg{pg_num}{ext}",
      'published': file_creation_time(fullpath),
      'wordCount': len(content),
      'pageContent': content,
      'token_count_estimate': len(tokenize(content))
    }
    write_to_server_documents(data, f"{slugify(filename)}-pg{pg_num}-{data.get('id')}", destination)

  move_source(parent_dir, f"{filename}{ext}", remove=remove)
  print(f"[SUCCESS]: {filename}{ext} converted & ready for embedding.\n")
