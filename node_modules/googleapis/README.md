<img src="https://avatars0.githubusercontent.com/u/1342004?v=3&s=96" alt="Google Inc. logo" title="Google" align="right" height="96" width="96"/>

# Google APIs Node.js Client

[![npm version][npmimg]][npm]
[![Downloads][downloadsimg]][downloads]
[![Known Vulnerabilities][snyk-image]][snyk-url]

[Node.js][node] client library for using Google APIs. Support for authorization and authentication with OAuth 2.0, API Keys and JWT tokens is included.

* [Google APIs](#google-apis)
* [Getting started](#getting-started)
  * [Installation](#installation)
  * [Using the client library](#using-the-client-library)
  * [Samples](#samples)
  * [API Reference](#api-reference)
* [Authentication and authorization](#authentication-and-authorization)
  * [OAuth2 client](#oauth2-client)
  * [Using API keys](#using-api-keys)
  * [Application default credentials](#application-default-credentials)
  * [Service account credentials](#service-account-credentials)
  * [Setting global or service-level auth](#setting-global-or-service-level-auth)
* [Usage](#usage)
  * [Specifying request body](#specifying-request-body)
  * [Media uploads](#media-uploads)
  * [Request Options](#request-options)
  * [Using a Proxy](#using-a-proxy)
  * [Supported APIs](#getting-supported-apis)
  * [TypeScript](#typescript)
  * [HTTP/2](#http2)
* [License](#license)
* [Contributing](#contributing)
* [Questions/problems?](#questionsproblems)

## Google APIs
The full list of supported APIs can be found on the [Google APIs Explorer][apiexplorer]. The API endpoints are automatically generated, so if the API is not in the list, it is currently not supported by this API client library.

### Working with Google Cloud Platform APIs?
When utilizing Google Cloud Platform APIs like Datastore, Cloud Storage, or Pub/Sub, it is advisable to leverage the @google-cloud client libraries. These libraries are purpose-built, idiomatic Node.js clients designed for specific Google Cloud Platform services. We recommend installing individual API packages, such as `@google-cloud/storage`. To explore a comprehensive list of Google Cloud Platform API-specific packages, please refer to https://cloud.google.com/nodejs/docs/reference.






### Support and maintenance
These client libraries are officially supported by Google. However, these libraries are considered complete and are in maintenance mode. This means that we will address critical bugs and security issues but will not add any new features. For Google Cloud Platform APIs, we recommend using [google-cloud-node](https://github.com/GoogleCloudPlatform/google-cloud-node) which is under active development.

This library supports the maintenance LTS, active LTS, and current release of node.js.  See the [node.js release schedule](https://github.com/nodejs/Release) for more information.

## Getting started

### Installation
This library is distributed on `npm`. In order to add it as a dependency, run the following command in your terminal:

```sh
npm install googleapis
```

If you need to reduce startup times, you can alternatively install a submodule as its own dependency. We make an effort to publish submodules that are __not__ in this [list](https://github.com/googleapis/google-cloud-node#google-cloud-nodejs-client-libraries). In order to add it as a dependency, run the following sample command in your terminal, replacing with your preferred API:

```sh
npm install @googleapis/docs
```

You can run [this search](https://www.npmjs.com/search?q=scope%3A@googleapis) on `npm`, to find a list of the submodules available.
### Using the client library

This is a very simple example. This creates a Blogger client and retrieves the details of a blog given the blog Id:

```js
const {google} = require('googleapis');

// Each API may support multiple versions. With this sample, we're getting
// v3 of the blogger API, and using an API key to authenticate.
const blogger = google.blogger({
  version: 'v3',
  auth: 'YOUR API KEY'
});

const params = {
  blogId: '3213900'
};

// get the blog details
blogger.blogs.get(params, (err, res) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(`The blog url is ${res.data.url}`);
});
```

Instead of using callbacks you can also use promises!

```js
blogger.blogs.get(params)
  .then(res => {
    console.log(`The blog url is ${res.data.url}`);
  })
  .catch(error => {
    console.error(error);
  });
```

Or async/await:

```js
async function runSample() {
  const res = await blogger.blogs.get(params);
  console.log(`The blog url is ${res.data.url}`);
}

runSample().catch(console.error);
```

Alternatively, you can make calls directly to the APIs by installing a submodule:

```js
const docs = require('@googleapis/docs')

const auth = new docs.auth.GoogleAuth({
  keyFilename: 'PATH_TO_SERVICE_ACCOUNT_KEY.json',
    // Scopes can be specified either as an array or as a single, space-delimited string.
  scopes: ['https://www.googleapis.com/auth/documents']
});
const authClient = await auth.getClient();

const client = await docs.docs({
    version: 'v1',
    auth: authClient
});

const createResponse = await client.documents.create({
    requestBody: {
      title: 'Your new document!',
    },
});

console.log(createResponse.data);
```

### Samples
There are a lot of [samples](https://github.com/googleapis/google-api-nodejs-client/tree/main/samples) 🤗  If you're trying to figure out how to use an API ... look there first! You can also search for a given API's
REST documentation on cloud.google.com, as well as documentation embedded in the source code comments (under src/apis/api-name/version).

### API Reference
This library has a full set of [API Reference Documentation](https://googleapis.dev/nodejs/googleapis/latest). This documentation is auto-generated, and the location may change.

## Authentication and authorization
There are multiple ways to authenticate to Google APIs. Some services support all authentication methods, while others may only support one or two.

- **OAuth2** - This allows you to make API calls on behalf of a given user.  In this model, the user visits your application, signs in with their Google account, and provides your application with authorization against a set of scopes.  [Learn more](#oauth2-client).

- **API Key** - With an API key, you can access your service from a client or the server.  Typically less secure, this is only available on a small subset of services with limited scopes.  [Learn more](#using-api-keys).

- **Application default credentials** - Provides automatic access to Google APIs using the [Google Cloud SDK](https://cloud.google.com/sdk/) for local development, or the [GCE Metadata Server](https://cloud.google.com/compute/docs/storing-retrieving-metadata) for applications deployed to Google Cloud Platform. [Learn more](#application-default-credentials).

- **Service account credentials** - In this model, your application talks directly to Google APIs using a Service Account. It's useful when you have a backend application that will talk directly to Google APIs from the backend. [Learn more](#service-account-credentials).

To learn more about the authentication client, see the [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs).

### OAuth2 client
This module comes with an [OAuth2][oauth] client that allows you to retrieve an access token, refresh it, and retry the request seamlessly. The basics of Google's OAuth2 implementation is explained on [Google Authorization and Authentication documentation][authdocs].

In the following examples, you may need a `CLIENT_ID`, `CLIENT_SECRET` and `REDIRECT_URL`. You can find these pieces of information by going to the [Developer Console][devconsole], clicking your project --> APIs & auth --> credentials.
- Navigate to the Cloud Console and [Create a new OAuth2 Client Id](https://console.cloud.google.com/apis/credentials/oauthclient)
- Select `Web Application` for the application type
- Add an authorized redirect URI with the value `http://localhost:3000/oauth2callback` (or applicable value for your scenario)
- Click `Create`, and `Ok` on the following screen
- Click the `Download` icon next to your newly created OAuth2 Client Id

Make sure to store this file in safe place, and *do not check this file into source control!*

For more information about OAuth2 and how it works, [see here][oauth].

A complete sample application that authorizes and authenticates with the OAuth2 client is available at [`samples/oauth2.js`][oauthexample].

#### Generating an authentication URL

To ask for permissions from a user to retrieve an access token, you redirect them to a consent page. To create a consent page URL:

```js
const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/blogger',
  'https://www.googleapis.com/auth/calendar'
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope, you can pass it as a string
  scope: scopes
});
```

**IMPORTANT NOTE** - The `refresh_token` is only returned on the first authorization. More details [here](https://github.com/googleapis/google-api-nodejs-client/issues/750#issuecomment-304521450).

#### Retrieve authorization code

Once a user has given permissions on the consent page, Google will redirect the page to the redirect URL you have provided with a code query parameter.

```
    GET /oauthcallback?code={authorizationCode}
```
#### Retrieve access token

With the code returned, you can ask for an access token as shown below:

```js
// This will provide an object with the access_token and refresh_token.
// Save these somewhere safe so they can be used at a later time.
const {tokens} = await oauth2Client.getToken(code)
oauth2Client.setCredentials(tokens);
```

With the credentials set on your OAuth2 client - you're ready to go!

#### Handling refresh tokens
Access tokens expire. This library will automatically use a refresh token to obtain a new access token if it is about to expire. An easy way to make sure you always store the most recent tokens is to use the `tokens` event:

```js
oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in my database!
    console.log(tokens.refresh_token);
  }
  console.log(tokens.access_token);
});
```
This tokens event only occurs in the first authorization, and you need to have set your `access_type` to `offline` when calling the  `generateAuthUrl` method to receive the refresh token. If you have already given your app the requisite permissions without setting the appropriate constraints for receiving a refresh token, you will need to re-authorize the application to receive a fresh refresh token. You can revoke your app's access to your account [here](https://myaccount.google.com/permissions).

To set the `refresh_token` at a later time, you can use the `setCredentials` method:

```js
oauth2Client.setCredentials({
  refresh_token: `STORED_REFRESH_TOKEN`
});
```

Once the client has a refresh token, access tokens will be acquired and refreshed automatically in the next call to the API.

Refresh tokens may stop working after they are granted, either because:
- The user has revoked your app's access
- The refresh token has not been used for 6 months
- The user changed passwords and the refresh token contains Gmail scopes
- The user account has exceeded a max number of live refresh tokens
- The application has a status of 'Testing' and the consent screen is configured for an external user type, causing the token to expire in 7 days

As a developer, you should write your code to handle the case where a refresh token is no longer working.


### Using API keys
You may need to send an API key with the request you are going to make. The following uses an API key to make a request to the Blogger API service to retrieve a blog's name, url, and its total amount of posts:

```js
const {google} = require('googleapis');
const blogger = google.blogger_v3({
  version: 'v3',
  auth: 'YOUR_API_KEY' // specify your API key here
});

const params = {
  blogId: '3213900'
};

async function main(params) {
  const res = await blogger.blogs.get({blogId: params.blogId});
  console.log(`${res.data.name} has ${res.data.posts.totalItems} posts! The blog url is ${res.data.url}`)
};

main().catch(console.error);
```

To learn more about API keys, please see the [documentation][usingkeys].

#### Application default credentials

Rather than manually creating an OAuth2 client, JWT client, or Compute client, the auth library can create the correct credential type for you, depending upon the environment your code is running under.

For example, a JWT auth client will be created when your code is running on your local developer machine, and a Compute client will be created when the same code is running on a configured instance of Google Compute Engine. The code below shows how to retrieve a default credential type, depending upon the runtime environment.

To use Application default credentials locally with the [Google Cloud SDK](https://cloud.google.com/sdk/), run:

```sh
$ gcloud auth application-default login
```

When running in GCP, service authorize is automatically provided via the GCE Metadata server.

```js
const {google} = require('googleapis');
const compute = google.compute('v1');

async function main () {
  const auth = new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: ['https://www.googleapis.com/auth/compute']
  });
  const authClient = await auth.getClient();

  // obtain the current project Id
  const project = await auth.getProjectId();

  // Fetch the list of GCE zones within a project.
  const res = await compute.zones.list({ project, auth: authClient });
  console.log(res.data);
}

main().catch(console.error);
```

### Service account credentials

Service accounts allow you to perform server-to-server, app-level authentication using a robot account. You will create a service account, download a keyfile, and use that to authenticate to Google APIs. To create a service account:
- Go to the [Create Service Account Key page](https://console.cloud.google.com/apis/credentials/serviceaccountkey)
- Select `New Service Account` in the drop down
- Click the `Create` button

Save the service account credential file somewhere safe, and *do not check this file into source control*!  To reference the service account credential file, you have a few options.

#### Using the `GOOGLE_APPLICATION_CREDENTIALS` env var
You can start process with an environment variable named `GOOGLE_APPLICATION_CREDENTIALS`. The value of this env var should be the full path to the service account credential file:

```sh
$ GOOGLE_APPLICATION_CREDENTIALS=./your-secret-key.json node server.js
```

#### Using the `keyFile` property
Alternatively, you can specify the path to the service account credential file via the `keyFile` property in the `GoogleAuth` constructor:

```js
const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: '/path/to/your-secret-key.json',
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});
```


### Setting global or service-level auth

You can set the `auth` as a global or service-level option so you don't need to specify it every request. For example, you can set `auth` as a global option:

```js
const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
);

// set auth as a global default
google.options({
  auth: oauth2Client
});
```

Instead of setting the option globally, you can also set the authentication client at the service-level:

```js
const {google} = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
);

const drive = google.drive({
  version: 'v2',
  auth: oauth2Client
});
```

See the [Options section](#request-options) for more information.

## Usage

### Specifying request body

The body of the request is specified in the `requestBody` parameter object of the request. The body is specified as a JavaScript object with key/value pairs. For example, this sample creates a watcher that posts notifications to a Google Cloud Pub/Sub topic when emails are sent to a gmail account:

```js
const res = await gmail.users.watch({
  userId: 'me',
  requestBody: {
    // Replace with `projects/${PROJECT_ID}/topics/${TOPIC_NAME}`
    topicName: `projects/el-gato/topics/gmail`
  }
});
console.log(res.data);
```

### Media uploads
This client supports multipart media uploads. The resource parameters are specified in the `requestBody` parameter object, and the media itself is specified in the `media.body` parameter with mime-type specified in `media.mimeType`.

This example uploads a plain text file to Google Drive with the title "Test" and contents "Hello World".

```js
const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

const res = await drive.files.create({
  requestBody: {
    name: 'Test',
    mimeType: 'text/plain'
  },
  media: {
    mimeType: 'text/plain',
    body: 'Hello World'
  }
});
```

You can also upload media by specifying `media.body` as a [Readable stream][stream]. This can allow you to upload very large files that cannot fit into memory.

```js
const fs = require('fs');

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

async function main() {
  const res = await drive.files.create({
    requestBody: {
      name: 'testimage.png',
      mimeType: 'image/png'
    },
    media: {
      mimeType: 'image/png',
      body: fs.createReadStream('awesome.png')
    }
  });
  console.log(res.data);
}

main().catch(console.error);
```

For more examples of creation and modification requests with media attachments, take a look at the `samples/drive/upload.js` sample.

### Request Options
For more fine-tuned control over how your API calls are made, we provide you with the ability to specify additional options that can be applied directly to the ['gaxios'][gaxios] object used in this library to make network calls to the API.

You may specify additional options either in the global `google` object or on a service client basis. The options you specify are attached to the `gaxios` object so whatever `gaxios` supports, this library supports. You may also specify global or per-service request parameters that will be attached to all API calls you make.

A full list of supported options can be [found here](https://github.com/googleapis/gaxios/#request-options).

#### Global options
You can choose default options that will be sent with each request. These options will be used for every service instantiated by the google client. In this example, the `timeout` property of `GaxiosOptions` will be set for every request:

```js
const {google} = require('googleapis');
google.options({
  // All requests made with this object will use these settings unless overridden.
  timeout: 1000,
  auth: auth
});
```

You can also modify the parameters sent with each request:

```js
const {google} = require('googleapis');
google.options({
  // All requests from all services will contain the above query parameter
  // unless overridden either in a service client or in individual API calls.
  params: {
    quotaUser: 'user123@example.com'
  }
});
```

#### Service-client options

You can also specify options when creating a service client.

```js
const blogger = google.blogger({
  version: 'v3',
  // All requests made with this object will use the specified auth.
  auth: 'API KEY';
});
```

By doing this, every API call made with this service client will use `'API KEY'` to authenticate.

**Note:** Created clients are **immutable** so you must create a new one if you want to specify different options.

Similar to the examples above, you can also modify the parameters used for every call of a given service:

```js
const blogger = google.blogger({
  version: 'v3',
  // All requests made with this service client will contain the
  // blogId query parameter unless overridden in individual API calls.
  params: {
    blogId: '3213900'
  }
});

// Calls with this drive client will NOT contain the blogId query parameter.
const drive = google.drive('v3');
...

```

#### Request-level options
You can specify an `auth` object to be used per request. Each request also inherits the options specified at the service level and global level.

For example:

```js
const {google} = require('googleapis');
const bigquery = google.bigquery('v2');

async function main() {

  // This method looks for the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS
  // environment variables.
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  const authClient = await auth.getClient();

  const projectId = await auth.getProjectId();

  const request = {
    projectId,
    datasetId: '<YOUR_DATASET_ID>',

    // This is a "request-level" option
    auth: authClient
  };

  const res = await bigquery.datasets.delete(request);
  console.log(res.data);

}

main().catch(console.error);
```

You can also override *gaxios* options per request, such as `url`, `method`, and `responseType`.

For example:

```js
const res = await drive.files.export({
  fileId: 'asxKJod9s79', // A Google Doc
  mimeType: 'application/pdf'
}, {
  // Make sure we get the binary data
  responseType: 'stream'
});
```

### Using a Proxy
You can use the following environment variables to proxy HTTP and HTTPS requests:

- `HTTP_PROXY` / `http_proxy`
- `HTTPS_PROXY` / `https_proxy`

When HTTP_PROXY / http_proxy are set, they will be used to proxy non-SSL requests that do not have an explicit proxy configuration option present. Similarly, HTTPS_PROXY / https_proxy will be respected for SSL requests that do not have an explicit proxy configuration option. It is valid to define a proxy in one of the environment variables, but then override it for a specific request, using the proxy configuration option.

### Getting Supported APIs
You can programmatically obtain the list of supported APIs, and all available versions:

```js
const {google} = require('googleapis');
const apis = google.getSupportedAPIs();
```

This will return an object with the API name as object property names, and an array of version strings as the object values;

### TypeScript
This library is written in TypeScript, and provides types out of the box. All classes and interfaces generated for each API are exported under the `${apiName}_${version}` namespace. For example, the Drive v3 API types are all available from the `drive_v3` namespace:

```ts
import {
  google,   // The top level object used to access services
  drive_v3, // For every service client, there is an exported namespace
  Auth,     // Namespace for auth related types
  Common,   // General types used throughout the library
} from 'googleapis';

// Note: using explicit types like `Auth.GoogleAuth` are only here for
// demonstration purposes.  Generally with TypeScript, these types would
// be inferred.
const auth: Auth.GoogleAuth = new google.auth.GoogleAuth();
const drive: drive_v3.Drive = google.drive({
  version: 'v3',
  auth,
});

// There are generated types for every set of request parameters
const listParams: drive_v3.Params$Resource$Files$List = {};
const res = await drive.files.list(listParams);

// There are generated types for the response fields as well
const listResults: drive_v3.Schema$FileList = res.data;
```

### HTTP/2
This library has support for [HTTP/2](https://developers.google.com/web/fundamentals/performance/http2). To enable it, use the `http2` option anywhere request parameters are accepted:

```js
const {google} = require('googleapis');
google.options({
  http2: true,
});
```

HTTP/2 is often more performant, as it allows multiplexing of multiple concurrent requests over a single socket. In a traditional HTTP/2 API, the client is directly responsible for opening and closing the sessions made to make requests.  To maintain compatibility with the existing API, this module will automatically re-use existing sessions, which are collected after idling for 500ms.  Much of the performance gains will be visible in batch style workloads, and tight loops.

## Release Notes & Breaking Changes
You can find a detailed list of breaking changes and new features in our [Release Notes][releasenotes]. If you've used this library before `25.x`, see our [Release Notes][releasenotes] to learn about migrating your code from `24.x.x` to `25.x.x`. It's pretty easy :)

## License
This library is licensed under Apache 2.0. Full license text is available in [LICENSE][license].

## Contributing
We love contributions! Before submitting a Pull Request, it's always good to start with a new issue first. To learn more, see [CONTRIBUTING][contributing].

## Questions/problems?
* Ask your development related questions on [Stackoverflow][stackoverflow].
* If you've found an bug/issue, please [file it on GitHub][bugs].


[snyk-image]: https://snyk.io/test/github/googleapis/google-api-nodejs-client/badge.svg
[snyk-url]: https://snyk.io/test/github/googleapis/google-api-nodejs-client
[npmimg]: https://img.shields.io/npm/v/googleapis.svg
[npm]: https://www.npmjs.org/package/googleapis
[bugs]: https://github.com/googleapis/google-api-nodejs-client/issues
[node]: http://nodejs.org/
[stackoverflow]: http://stackoverflow.com/questions/tagged/google-api-nodejs-client
[apiexplorer]: https://developers.google.com/apis-explorer
[usingkeys]: https://support.google.com/cloud/answer/6158862?hl=en
[contributing]: https://github.com/googleapis/google-api-nodejs-client/blob/main/CONTRIBUTING.md
[license]: https://github.com/googleapis/google-api-nodejs-client/tree/main/LICENSE
[authdocs]: https://developers.google.com/identity/protocols/OpenIDConnect
[gaxios]: https://github.com/JustinBeckwith/gaxios
[stream]: http://nodejs.org/api/stream.html#stream_class_stream_readable
[releasenotes]: https://github.com/googleapis/google-api-nodejs-client/releases
[devconsole]: https://console.cloud.google.com/apis/credentials
[oauth]: https://developers.google.com/identity/protocols/OAuth2
[oauthexample]: https://github.com/googleapis/google-api-nodejs-client/tree/main/samples/oauth2.js
[options]: https://github.com/googleapis/google-api-nodejs-client/tree/main#options
[googlecloud]: https://cloud.google.com/nodejs/docs/reference/libraries
[googlecloudapis]: https://cloud.google.com/nodejs/docs/reference/apis
[cloudplatform]: https://cloud.google.com/docs/
[downloadsimg]: https://img.shields.io/npm/dm/googleapis.svg
[downloads]: https://www.npmjs.com/package/googleapis
