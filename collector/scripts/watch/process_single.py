import os
from .filetypes import FILETYPES
from .utils import move_source

RESERVED = ['__HOTDIR__.md']

# This script will do a one-off processing of a specific document that exists in hotdir.
# For this function we remove the original source document since there is no need to keep it and it will
# only occupy additional disk space.
def process_single(directory, target_doc):
  if os.path.isdir(f"{directory}/{target_doc}") or target_doc in RESERVED: return (False, "Not a file")
  
  if os.path.exists(f"{directory}/{target_doc}") is False: 
    print(f"{directory}/{target_doc} does not exist.")
    return (False, f"{directory}/{target_doc} does not exist.")

  filename, fileext = os.path.splitext(target_doc)
  if filename in ['.DS_Store'] or fileext == '': return False
  if fileext == '.lock':
    print(f"{filename} is locked - skipping until unlocked")
    return (False, f"{filename} is locked - skipping until unlocked")

  if fileext not in FILETYPES.keys():
    print(f"{fileext} not a supported file type for conversion. It will not be processed.")
    move_source(new_destination_filename=target_doc, failed=True, remove=True)
    return (False, f"{fileext} not a supported file type for conversion. It will not be processed.")

  # Returns Tuple of (Boolean, String|None) of success status and possible error message.
  # Error message will display to user.
  return FILETYPES[fileext](
    directory=directory,
    filename=filename,
    ext=fileext,
    remove_on_complete=True # remove source document to save disk space.
  )