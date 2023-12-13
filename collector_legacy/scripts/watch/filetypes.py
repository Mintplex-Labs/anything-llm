from .convert.as_text import as_text
from .convert.as_markdown import as_markdown
from .convert.as_pdf import as_pdf
from .convert.as_docx import as_docx, as_odt
from .convert.as_mbox import as_mbox
from .convert.as_html import as_html

FILETYPES = {
    '.txt': as_text,
    '.md': as_markdown,
    '.pdf': as_pdf,
    '.docx': as_docx,
    '.odt': as_odt,
    '.mbox': as_mbox, 
    '.html': as_html, 
}

ACCEPTED_MIMES = {
    'text/plain': ['.txt', '.md'],
    'text/html': ['.html'], 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.oasis.opendocument.text': ['.odt'],
    'application/pdf': ['.pdf'],
    'application/mbox': ['.mbox'], 
}
