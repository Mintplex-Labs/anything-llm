import os
from flask import Flask, json, request
from scripts.watch.process_single import process_single
from scripts.watch.filetypes import ACCEPTED_MIMES
api = Flask(__name__)

STORAGE_DIR = os.getenv('STORAGE_DIR', '/storage')
WATCH_DIRECTORY = os.path.join(STORAGE_DIR, 'collector', "hotdir") if os.getenv('STORAGE_DIR') is not None else 'hotdir'

@api.route('/process', methods=['POST'])
def process_file():
  content = request.json
  target_filename = content.get('filename')
  print(f"Processing {target_filename}")
  success, reason = process_single(WATCH_DIRECTORY, target_filename)
  return json.dumps({'filename': target_filename, 'success': success, 'reason': reason})

@api.route('/accepts', methods=['GET'])
def get_accepted_filetypes():
  return json.dumps(ACCEPTED_MIMES)

@api.route('/', methods=['GET'])
def root():
  return "<p>Use POST /process with filename key in JSON body in order to process a file. File by that name must exist in hotdir already.</p>"