import json, pyppeteer
from datetime import datetime
from .watch.utils import guid
from dotenv import load_dotenv
from .watch.utils import guid
from .utils import tokenize
from requests_html import AsyncHTMLSession

load_dotenv()

def normalize_url(url):
    if(url.endswith('.web')):
        return url
    return f"{url}.web"

def append_meta(request, text, metadata_only = False):
  meta = {
    'id': guid(),
    'url': normalize_url(request.url),
    'title': request.html.find('title', first=True).text if len(request.html.find('title')) != 0 else '',
    'docAuthor': 'N/A',
    'description': request.html.find('meta[name="description"]', first=True).attrs.get('content') if  request.html.find('meta[name="description"]', first=True) != None else '',
    'docSource': 'web page',
    'chunkSource': request.url,
    'published':request.html.find('meta[property="article:published_time"]', first=True).attrs.get('content') if request.html.find('meta[property="article:published_time"]', first=True) != None else datetime.today().strftime('%Y-%m-%d %H:%M:%S'),
    'wordCount': len(text.split(' ')),
    'pageContent': text,
    'token_count_estimate':len(tokenize(text)),
  }
  return "Article JSON Metadata:\n"+json.dumps(meta)+"\n\n\nText Content:\n" + text if metadata_only == False else meta

class AsyncHTMLSessionFixed(AsyncHTMLSession):
    """
    pip3 install websockets==6.0 --force-reinstall
    """
    def __init__(self, **kwargs):
        super(AsyncHTMLSessionFixed, self).__init__(**kwargs)
        self.__browser_args = kwargs.get("browser_args", ["--no-sandbox"])

    @property
    async def browser(self):
        if not hasattr(self, "_browser"):
            self._browser = await pyppeteer.launch(ignoreHTTPSErrors=not(self.verify), headless=True, handleSIGINT=False, handleSIGTERM=False, handleSIGHUP=False, args=self.__browser_args)

        return self._browser