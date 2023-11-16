"""
Tweepy implementation of twitter reader. Requires the 4 twitter keys to operate.
"""

import tweepy
import os, time
import pandas as pd
import json
from .utils import tokenize, ada_v2_cost
from .watch.utils import guid

def twitter():
    #get user and number of tweets to read
    username = input("user timeline to read from (blank to ignore): ")
    searchQuery = input("Search term, or leave blank to get user tweets (blank to ignore): ")
    tweetCount = input("Gather the last number of tweets: ")

    # Read your API keys to call the API.
    consumer_key = os.environ.get("TW_CONSUMER_KEY")
    consumer_secret = os.environ.get("TW_CONSUMER_SECRET")
    access_token = os.environ.get("TW_ACCESS_TOKEN")
    access_token_secret = os.environ.get("TW_ACCESS_TOKEN_SECRET")

    # Check if any of the required environment variables is missing.
    if not consumer_key or not consumer_secret or not access_token or not access_token_secret:
        raise EnvironmentError("One of the twitter API environment variables are missing.")

    # Pass in our twitter API authentication key
    auth = tweepy.OAuth1UserHandler(
        consumer_key, consumer_secret, access_token, access_token_secret
    )

    # Instantiate the tweepy API
    api = tweepy.API(auth, wait_on_rate_limit=True)

    try:
        if (searchQuery == ''):
            tweets = api.user_timeline(screen_name=username, tweet_mode = 'extended', count=tweetCount)
        else:
            tweets = api.search_tweets(q=searchQuery, tweet_mode = 'extended', count=tweetCount)

        # Pulling Some attributes from the tweet
        attributes_container = [
            [tweet.id, tweet.user.screen_name, tweet.created_at, tweet.favorite_count, tweet.source, tweet.full_text]
            for tweet in tweets
        ]

        # Creation of column list to rename the columns in the dataframe
        columns = ["id", "Screen Name", "Date Created", "Number of Likes", "Source of Tweet", "Tweet"]

        # Creation of Dataframe
        tweets_df = pd.DataFrame(attributes_container, columns=columns)

        totalTokens = 0
        for index, row in tweets_df.iterrows():
            meta_link = twitter_meta(row, True)
            output_filename = f"twitter-{username}-{row['Date Created']}.json"
            output_path = f"./outputs/twitter-logs"

            transaction_output_filename = f"tweet-{username}-{row['id']}.json"
            transaction_output_dir = f"../server/storage/documents/twitter-{username}"

            if not os.path.isdir(output_path):
                os.makedirs(output_path)

            if not os.path.isdir(transaction_output_dir):
                os.makedirs(transaction_output_dir)

            full_text = twitter_meta(row)
            tokenCount = len(tokenize(full_text))
            meta_link['pageContent'] = full_text
            meta_link['token_count_estimate'] = tokenCount
            totalTokens += tokenCount

            with open(f"{output_path}/{output_filename}", 'w', encoding='utf-8') as file:
                json.dump(meta_link, file, ensure_ascii=True, indent=4)

            with open(f"{transaction_output_dir}/{transaction_output_filename}", 'w', encoding='utf-8') as file:
                json.dump(meta_link, file, ensure_ascii=True, indent=4)

            # print(f"{transaction_output_dir}/{transaction_output_filename}")

        print(f"{tokenCount} tokens written over {tweets_df.shape[0]} records.")

    except BaseException as e:
        print("Status Failed: ", str(e))
        time.sleep(3)


def twitter_meta(row, metadata_only = False):
  # Note that /anyuser is a known twitter hack for not knowing the user's handle
  # https://stackoverflow.com/questions/897107/can-i-fetch-the-tweet-from-twitter-if-i-know-the-tweets-id
  url = f"http://twitter.com/anyuser/status/{row['id']}"
  title = f"Tweet {row['id']}"
  meta = {
    'id': guid(),
    'url': url,
    'title':  title,
    'description': 'Tweet from ' + row["Screen Name"],
    'published': row["Date Created"].strftime('%Y-%m-%d %H:%M:%S'),
    'wordCount': len(row["Tweet"]),
  }
  return "Tweet JSON Metadata:\n"+json.dumps(meta)+"\n\n\nText Content:\n" + row["Tweet"] if metadata_only == False else meta
