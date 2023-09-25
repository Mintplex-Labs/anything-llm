# How to collect data for vectorizing

This process should be run first. This will enable you to collect a ton of data across various sources. Currently the following services are supported:

:white_check_mark: YouTube Channels \
:white_check_mark: Medium \
:white_check_mark: Substack \
:white_check_mark: Arbitrary Link \
:white_check_mark: Gitbook \
:white_check_mark: Local Files (.txt, .pdf, etc) [See full list](./hotdir/__HOTDIR__.md) _these resources are under development or require PR_ \
:hourglass: Twitter

  ![Choices](../images/choices.png)

### Requirements

:snake: Python 3.8+ \
:cloud: Google Cloud Account (for YouTube channels) \
:file_folder: `brew install pandoc` [pandoc:link:](https://pandoc.org/installing.html) (for .ODT document processing)

### Setup

This example will be using python3.9, but will work with 3.8+. Tested on MacOs. Untested on Windows

1. install virtualenv for python3.8+ first before any other steps. `python3.9 -m pip install virtualenv`
2. `cd collector` from root directory
3. `python3.9 -m virtualenv v-env`
4. `source v-env/bin/activate`
5. `pip install -r requirements.txt`
6. `cp .env.example .env`
7. `python main.py` for interactive collection or `python watch.py` to process local documents.
8. Select the option you want and follow follow the prompts - Done!
9. run `deactivate` to get back to regular shell

### Outputs

All JSON file data is cached in the `output/` folder. This is to prevent redundant API calls to services which may have rate limits to quota caps. Clearing out the `output/` folder will execute the script as if there was no cache.

As files are processed you will see data being written to both the `collector/outputs` folder as well as the `server/documents` folder. Later in this process, once you boot up the server you will then bulk vectorize this content from a simple UI!

If collection fails at any point in the process it will pick up where it last bailed out so you are not reusing credits.

### Running the document processing API locally

From the `collector` directory with the `v-env` active run `flask run --host '0.0.0.0' --port 8888`.
Now uploads from the frontend will be processed as if you ran the `watch.py` script manually.

**Docker**: If you run this application via docker the API is already started for you and no additional action is needed.

### How to get a Google Cloud API Key (YouTube data collection only)

**required to fetch YouTube transcripts and data**

1. Have a google account
2. [Visit the GCP Cloud Console:link:](https://console.cloud.google.com/welcome)
3. Click on dropdown in top right > Create new project. Name it whatever you like

![GCP Project Bar](../images/gcp-project-bar.png)

4. [Enable YouTube Data APIV3:link:](https://console.cloud.google.com/apis/library/youtube.googleapis.com)
5. Once enabled generate a Credential key for this API
6. Paste your key after `GOOGLE_APIS_KEY=` in your `collector/.env` file.

### Using the Twitter API

**\*required to get data form twitter with tweepy**

- Go to [Twitter developer portal:link:](https://developer.twitter.com/en/portal/dashboard) with your twitter account
- Create a new Project App
  - Get your 4 keys and place them in your `collector.env` file
    * `TW_CONSUMER_KEY`
    * `TW_CONSUMER_SECRET`
    * `TW_ACCESS_TOKEN`
    * `TW_ACCESS_TOKEN_SECRET`
  - populate the `.env` with the values
