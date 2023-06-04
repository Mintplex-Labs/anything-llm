import os, json
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter, JSONFormatter
from .utils import tokenize, ada_v2_cost
from .yt_utils import fetch_channel_video_information, get_channel_id, clean_text, append_meta, get_duration
from alive_progress import alive_it
    
# Example Channel URL https://www.youtube.com/channel/UCmWbhBB96ynOZuWG7LfKong
# Example Channel URL https://www.youtube.com/@mintplex

def youtube():
    channel_link = input("Paste in the URL of a YouTube channel: ")
    channel_id = get_channel_id(channel_link)

    if channel_id == None or len(channel_id) == 0:
        print("Invalid input - must be full YouTube channel URL")
        exit(1)

    channel_data = fetch_channel_video_information(channel_id)
    transaction_output_dir = f"../server/documents/youtube-{channel_data.get('channelTitle')}"

    if os.path.isdir(transaction_output_dir) == False:
      os.makedirs(transaction_output_dir)

    print(f"\nFetching transcripts for {len(channel_data.get('items'))} videos - please wait.\nStopping and restarting will not refetch known transcripts in case there is an error.\nSaving results to: {transaction_output_dir}.")
    totalTokenCount = 0
    for video in alive_it(channel_data.get('items')):
      video_file_path = transaction_output_dir + f"/video-{video.get('id')}.json"
      if os.path.exists(video_file_path) == True:
        continue
       
      formatter = TextFormatter()
      json_formatter = JSONFormatter()
      try:
        transcript = YouTubeTranscriptApi.get_transcript(video.get('id'))
        raw_text = clean_text(formatter.format_transcript(transcript))
        duration = get_duration(json_formatter.format_transcript(transcript))

        if(len(raw_text) > 0):
          fullText = append_meta(video, duration, raw_text)
          tokenCount = len(tokenize(fullText))
          video['pageContent'] = fullText
          video['token_count_estimate'] = tokenCount
          totalTokenCount += tokenCount
          with open(video_file_path, 'w', encoding='utf-8') as file:
            json.dump(video, file, ensure_ascii=True, indent=4)
      except:
        print("There was an issue getting the transcription of a video in the list - likely because captions are disabled. Skipping")
        continue
    
    print(f"[Success]: {len(channel_data.get('items'))} video transcripts fetched!")
    print(f"\n\n////////////////////////////")
    print(f"Your estimated cost to embed all of this data using OpenAI's text-embedding-ada-002 model at $0.0004 / 1K tokens will cost {ada_v2_cost(totalTokenCount)} using {totalTokenCount} tokens.")
    print(f"////////////////////////////\n\n")
    exit(0)
