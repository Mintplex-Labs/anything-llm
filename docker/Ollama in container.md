This build allows us to bundle a CPU only version of Ollama into the container for minimal space as well as still be able to leverage the CLI and API calls for ollama.

This, however, is very slow in the container since it is CPU bound and also running inside of the container.

```
curl --location 'http://127.0.0.1:11434/api/chat' \
--header 'Content-Type: application/json' \
--data '{
  "model": "router",
  "messages": [
       {
        "role": "user",
        "content": "\nYou are a helpful assistant designed to find the best suited route.\nYou are provided with route description within <routes></routes> XML tags:\n<routes>\n\n[{\"name\": \"code_generation\", \"description\": \"Writing code, debugging, fixing errors, handling stack traces, and generating functions based on requirements.\"}, {\"name\": \"healthcare\", \"description\": \"Healthcare related requests like diagnosis, treatment, and medication management.\"}, {\"name\": \"logistics\", \"description\": \"Logistics related requests like shipping, tracking, and inventory management.\"}, {\"name\": \"legal_compliance\", \"description\": \"Legal advice, contract review, regulatory compliance (GDPR, HIPAA), and intellectual property inquiries.\"}, {\"name\": \"financial_analysis\", \"description\": \"Stock market analysis, accounting, tax questions, investment strategies, and interpreting financial statements.\"}, {\"name\": \"creative_writing\", \"description\": \"Storytelling, poetry, scriptwriting, marketing copy, and roleplay scenarios.\"}, {\"name\": \"data_analytics\", \"description\": \"Statistical analysis, interpreting graphs/charts, data cleaning concepts, machine learning methodology, and explaining trends in datasets.\"}, {\"name\": \"travel_concierge\", \"description\": \"Consumer travel planning, flight bookings, hotel recommendations, tourism itineraries, and visa/passport inquiries.\"}]\n\n</routes>\n\n<conversation>\n\n[{\"role\": \"user\", \"content\": \"Help me diagnose the issue with this MRI scan, it shows a small lesion in the left frontal lobe.\"}]\n\n</conversation>\n\nYour task is to decide which route is best suit with user intent on the conversation in <conversation></conversation> XML tags.  Follow the instruction:\n1. If the latest intent from user is irrelevant or user intent is full filled, respond with other route {\"route\": \"other\"}.\n2. You must analyze the route descriptions and find the best match route for user latest intent. \n3. Only respond with the name of the route that best matches the user'\''s request, use the exact name in the <routes></routes> in JSON format.\n4. Prioritize the most recent user message when deciding the best route.\n\nBased on your analysis, provide your response in the following JSON formats if you decide to match any route:\n{\"route\": \"route_name\"} \n"
    }
  ],
  "stream": false,
  "options": {
    "num_predict": 1024
  }
}
'
```

Results in an avg 3.18s response time
```
{
    "model": "router",
    "created_at": "2026-01-22T21:42:19.408240676Z",
    "message": {
        "role": "assistant",
        "content": "{'route': 'healthcare'}"
    },
    "done": true,
    "done_reason": "stop",
    "total_duration": 3177145585,
    "load_duration": 76131083,
    "prompt_eval_count": 485,
    "prompt_eval_duration": 330789000,
    "eval_count": 8,
    "eval_duration": 2764881418
}
```