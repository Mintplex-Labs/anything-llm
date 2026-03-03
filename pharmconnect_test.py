import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# Load your .env file
load_dotenv("docker/.env")

client = InferenceClient(
    api_key=os.environ["HF_TOKEN"],
)

completion = client.chat.completions.create(
    model="mistralai/Mistral-7B-Instruct-v0.3",
    messages=[
        {
            "role": "system",
            "content": "You are PharmConnect AI, helping Nigerian vendors import pharmaceuticals from Germany."
        },
        {
            "role": "user",
            "content": "What documents do I need to import Amoxicillin from Germany to Nigeria?"
        }
    ],
    max_tokens=500,
)

print(completion.choices[0].message.content)
