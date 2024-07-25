import argparse
import requests
import json

# Set up argument parser
parser = argparse.ArgumentParser(description='Send a message to a chat API')
parser.add_argument('--message', required=True, help='Message to send')
parser.add_argument('--id', required=True, help='Session ID')

# Parse arguments
args = parser.parse_args()

# Assign message and sessionId from parsed arguments
message = args.message
session_id = args.id

# Define the headers
headers = {
    "Accept": "text/event-stream",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.9",
    "Content-Type": "text/plain;charset=UTF-8",
    "Dnt": "1",
    "Host": "advantageintegrationai.duckdns.org:3001",
    "Origin": "null"
}

# Define the payload with the variables
body = {
    "message": message,
    "model": None,
    "prompt": None,
    "sessionId": session_id,
    "temperature": None
}

# Convert the payload to JSON string
json_body = json.dumps(body)

# Make the POST request with stream=True
response = requests.post(
    "http://advantageintegrationai.duckdns.org:3001/api/embed/66d0afae-0a65-47c5-94fe-3c8cdd5cf0ea/stream-chat",
    headers=headers,
    data=json_body,
    stream=True
)

# Gather the "textResponse" from each streamed response
full_response = ""
for line in response.iter_lines():
    if line:
        # Decode line and attempt to parse JSON
        decoded_line = line.decode('utf-8').strip()

        # Some streamed responses might have a prefix like "data: "
        # Try to extract JSON part if present
        json_start = decoded_line.find('{')
        if json_start != -1:
            try:
                data = json.loads(decoded_line[json_start:])
                # Append only the "textResponse" part
                if 'textResponse' in data:
                    full_response += data['textResponse']
            except json.JSONDecodeError:
                print(f"Error decoding JSON from line: {decoded_line}")

# Print the full response or return it from a function
print(full_response)
