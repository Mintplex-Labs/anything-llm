import os, re, json, requests
from slugify import slugify
from dotenv import load_dotenv

load_dotenv()


def is_yt_short(video_id):
    url = "https://www.youtube.com/shorts/" + video_id
    ret = requests.head(url, timeout=20)
    return ret.status_code == 200


def get_channel_id(channel_link):
    if "@" in channel_link:
        pattern = r"https?://www\.youtube\.com/(@\w+)/?"
        match = re.match(pattern, channel_link)
        if match is False or match is None:
            return None
        else:
            handle = match.group(1)
        print("Need to map username to channelId - this can take a while sometimes.")
        response = requests.get(f"https://yt.lemnoslife.com/channels?handle={handle}", timeout=20)

        if response.ok is False:
            print(
                "Handle => ChannelId mapping endpoint is too slow "
                "- use regular youtube.com/channel URL"
            )
            return None

        json_data = response.json()
        return json_data.get("items")[0].get("id")
    else:
        pattern = r"youtube\.com/channel/([\w-]+)"
        match = re.search(pattern, channel_link)
        return match.group(1) if match else None


def clean_text(text):
    return re.sub(r"\[.*?\]", "", text)


def append_meta(video, duration, text):
    meta = {
        "youtubeURL": f"https://youtube.com/watch?v={video.get('id')}",
        "thumbnail": video.get("thumbnail"),
        "description": video.get("description"),
        "createdAt": video.get("published"),
        "videoDurationInSeconds": duration,
    }
    return (
        "Video JSON Metadata:\n" + json.dumps(meta, indent=4) + "\n\n\nAudio Transcript:\n" + text
    )


def get_duration(json_str):
    data = json.loads(json_str)
    return data[-1].get("start")


def fetch_channel_video_information(channel_id, window_size=50):
    if channel_id is None or len(channel_id) == 0:
        print("No channel id provided!")
        exit(1)

    if os.path.isdir("./outputs/channel-logs") is False:
        os.makedirs("./outputs/channel-logs")

    file_path = f"./outputs/channel-logs/channel-{channel_id}.json"
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as file:
            print(
                f"Returning cached data for channel {channel_id}. If you do not wish to use "
                f"stored data then delete the file for this channel to allow refetching."
            )
            return json.load(file)

    if os.getenv("GOOGLE_APIS_KEY") is None:
        print("GOOGLE_APIS_KEY env variable not set!")
        exit(1)

    done = False
    current_page = None
    page_tokens = []
    items = []
    data = {
        "id": channel_id,
    }

    print("Fetching first page of results...")
    while not done:
        url = (
            f"https://www.googleapis.com/youtube/v3/search?key={os.getenv('GOOGLE_APIS_KEY')}&"
            f"channelId={channel_id}&part=snippet,id&order=date&type=video&maxResults={window_size}"
        )
        if current_page is not None:
            print(f"Fetching page ${current_page}")
            url += f"&pageToken={current_page}"

        req = requests.get(url, timeout=20)
        if req.ok is False:
            print("Could not fetch channel_id items!")
            exit(1)

        response = req.json()
        current_page = response.get("nextPageToken")
        if current_page in page_tokens:
            print("All pages iterated and logged!")
            done = True
            break

        for item in response.get("items"):
            if "id" in item and "videoId" in item.get("id"):
                if is_yt_short(item.get("id").get("videoId")):
                    print(f"Filtering out YT Short {item.get('id').get('videoId')}")
                    continue

                if data.get("channelTitle") is None:
                    data["channelTitle"] = slugify(item.get("snippet").get("channelTitle"))

                new_item = {
                    "id": item.get("id").get("videoId"),
                    "url": f"https://youtube.com/watch?v={item.get('id').get('videoId')}",
                    "title": item.get("snippet").get("title"),
                    "description": item.get("snippet").get("description"),
                    "thumbnail": item.get("snippet").get("thumbnails").get("high").get("url"),
                    "published": item.get("snippet").get("publishTime"),
                }
                items.append(new_item)

        page_tokens.append(current_page)

    data["items"] = items
    with open(file_path, "w+", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=True, indent=2)
        print(
            f"{len(items)} videos found for channel {data.get('channelTitle')}. "
            f"Saved to channel-logs/channel-{channel_id}.json"
        )

    return data
