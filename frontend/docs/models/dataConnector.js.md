```javascript
import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import showToast from "@/utils/toast";

const DataConnector = {
  github: {
    branches: async ({ repo, accessToken }) => {
      return await fetch(`${API_BASE}/ext/github/branches`, {
        method: "POST",
        headers: baseHeaders(),
        cache: "force-cache",
        body: JSON.stringify({ repo, accessToken }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return res.data;
        })
        .then((data) => {
          return { branches: data?.branches || [], error: null };
        })
        .catch((e) => {
          console.error(e);
          showToast(e.message, "error");
          return { branches: [], error: e.message };
        });
    },
    collect: async function ({ repo, accessToken, branch, ignorePaths = [] }) {
      return await fetch(`${API_BASE}/ext/github/repo`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ repo, accessToken, branch, ignorePaths }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },
  youtube: {
    transcribe: async ({ url }) => {
      return await fetch(`${API_BASE}/ext/youtube/transcript`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ url }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },
  websiteDepth: {
    scrape: async ({ url, depth, maxLinks }) => {
      return await fetch(`${API_BASE}/ext/website-depth`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ url, depth, maxLinks }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },

  confluence: {
    collect: async function ({ pageUrl, username, accessToken }) {
      return await fetch(`${API_BASE}/ext/confluence`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({
          pageUrl,
          username,
          accessToken,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },
};

export default DataConnector;

```
**DataConnector Interface Documentation**

### Purpose and Usage

The DataConnector interface provides a unified way to interact with various data sources, such as GitHub, YouTube, Confluence, and website scraping. This interface is designed to simplify data retrieval and manipulation within the codebase.

### Methods

#### github.branches({ repo, accessToken })

**Purpose:** Retrieve a list of branches for a given GitHub repository.

**Parameters:**

* `repo`: The name of the GitHub repository.
* `accessToken`: The access token for the GitHub API.

**Return Type:** An object containing an array of branch names and an optional error message.

**Example:** `const branches = await DataConnector.github.branches({ repo: 'my-repo', accessToken: 'my-token' });`

#### github.collect({ repo, accessToken, branch, ignorePaths=[] })

**Purpose:** Collect data from a specific GitHub repository, branch, and path(s).

**Parameters:**

* `repo`: The name of the GitHub repository.
* `accessToken`: The access token for the GitHub API.
* `branch`: The name of the GitHub branch to retrieve data from.
* `ignorePaths`: An optional array of paths to ignore during data collection.

**Return Type:** An object containing the collected data and an optional error message.

**Example:** `const data = await DataConnector.github.collect({ repo: 'my-repo', accessToken: 'my-token', branch: 'main' });`

#### youtube.transcribe({ url })

**Purpose:** Transcribe a YouTube video based on its URL.

**Parameter:**

* `url`: The URL of the YouTube video to transcribe.

**Return Type:** An object containing the transcript data and an optional error message.

**Example:** `const transcript = await DataConnector.youtube.transcribe({ url: 'https://www.youtube.com/watch?v=my-video' });`

#### websiteDepth.scrape({ url, depth, maxLinks })

**Purpose:** Scrape data from a website based on its URL, scraping depth, and maximum number of links.

**Parameters:**

* `url`: The URL of the website to scrape.
* `depth`: The maximum recursion depth for scraping.
* `maxLinks`: The maximum number of links to follow during scraping.

**Return Type:** An object containing the scraped data and an optional error message.

**Example:** `const data = await DataConnector.websiteDepth.scrape({ url: 'https://www.example.com', depth: 2, maxLinks: 10 });`

#### confluence.collect({ pageUrl, username, accessToken })

**Purpose:** Collect data from a Confluence page based on its URL and authentication credentials.

**Parameters:**

* `pageUrl`: The URL of the Confluence page to collect data from.
* `username`: The username for the Confluence API.
* `accessToken`: The access token for the Confluence API.

**Return Type:** An object containing the collected data and an optional error message.

**Example:** `const data = await DataConnector.confluence.collect({ pageUrl: 'https://my-confluence.com/page', username: 'my-username', accessToken: 'my-token' });`

### Dependencies

The DataConnector interface relies on various dependencies, including:

* GitHub API
* YouTube API
* Confluence API
* Website scraping functionality

These dependencies are used to interact with the respective data sources and retrieve data as needed.

### Clarity and Consistency

This documentation is designed to be clear, concise, and easy to understand. The interface methods are documented in a consistent manner, providing details on purpose, parameters, return types, and examples. This should make it easier for developers to use the DataConnector interface effectively.