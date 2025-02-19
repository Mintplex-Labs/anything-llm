# Setting up the Google Docs Connector

The Google Docs connector allows you to import documents directly from your Google Drive into AnythingLLM. This guide will help you set up the necessary credentials and configure the connector.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. A GCP project with the Google Drive API and Google Docs API enabled
3. OAuth 2.0 credentials for your application

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs for your project:
   - Google Drive API
   - Google Docs API

### 2. Create OAuth 2.0 Credentials

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "OAuth 2.0 Client ID"
3. Configure the OAuth consent screen if you haven't already
4. For application type, select "Web application"
5. Add the following authorized redirect URIs:
   - `http://localhost:3000/api/ext/googledocs/callback` (for local development)
   - `https://your-domain.com/api/ext/googledocs/callback` (for production)
6. Click "Create" and note down the Client ID and Client Secret

### 3. Configure Environment Variables

Add the following variables to your `.env` file:

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/ext/googledocs/callback
```

For production, update the `GOOGLE_REDIRECT_URI` to match your domain.

## Usage

1. In the AnythingLLM workspace, click on "Add Documents"
2. Select "Google Documents" from the list of connectors
3. If not already authorized, click "Authorize Google Docs"
4. You will be redirected to Google's OAuth consent screen
5. After authorization, you'll see a list of your Google Docs
6. Select the documents you want to import
7. Click "Import Selected Documents"

## Security Considerations

- The connector uses OAuth 2.0 for secure authentication
- Access tokens are stored securely and encrypted
- Only read access is requested for your documents
- No document content is stored permanently, only processed for embedding

## Troubleshooting

1. **Authorization Failed**
   - Verify your OAuth 2.0 credentials are correct
   - Check that the redirect URI matches exactly
   - Ensure the necessary APIs are enabled

2. **No Documents Found**
   - Verify you have Google Docs in your Drive
   - Check that the OAuth scope includes Drive access

3. **Import Failed**
   - Check your internet connection
   - Verify the document permissions
   - Ensure the document format is supported

For additional help, please refer to the [main documentation](https://docs.anythingllm.com) or create an issue on GitHub. 