import os
from whaaaaat import prompt, Separator
from scripts.youtube import youtube
from scripts.link import link, links
from scripts.substack import substack
from scripts.medium import medium
from scripts.gitbook import gitbook

def main():
  if os.name == 'nt':
    methods = {
      '1': 'YouTube Channel',
      '2': 'Article or Blog Link',
      '3': 'Substack',
      '4': 'Medium',
      '5': 'Gitbook'
    }
    print("There are options for data collection to make this easier for you.\nType the number of the method you wish to execute.")
    print("1. YouTube Channel\n2. Article or Blog Link (Single)\n3. Substack\n4. Medium\n\n[In development]:\nTwitter\n\n")
    selection = input("Your selection: ")
    method = methods.get(str(selection))
  else:
    questions = [
      {
          "type": "list",
          "name": "collector",
          "message": "What kind of data would you like to add to convert into long-term memory?",
          "choices": [
              "YouTube Channel",
              "Substack",
              "Medium",
              "Article or Blog Link(s)",
              "Gitbook",
              Separator(),
              {"name": "Twitter", "disabled": "Needs PR"},
              "Abort",
          ],
      },
    ]
    method = prompt(questions).get('collector')
  
  if('Article or Blog Link' in method):
    questions = [
      {
          "type": "list",
          "name": "collector",
          "message": "Do you want to scrape a single article/blog/url or many at once?",
          "choices": [
            'Single URL',
            'Multiple URLs',
            'Abort',
          ],
      },
    ]
    method = prompt(questions).get('collector')
    if(method == 'Single URL'):
      link()
      exit(0)
    if(method == 'Multiple URLs'):
      links()
      exit(0)

  if(method == 'Abort'): exit(0)
  if(method == 'YouTube Channel'): 
    youtube()
    exit(0)
  if(method == 'Substack'):
    substack()
    exit(0)
  if(method == 'Medium'):
    medium()
    exit(0)
  if(method == 'Gitbook'):
    gitbook()
    exit(0)

  print("Selection was not valid.")
  exit(1)

if __name__ == "__main__":
  main()