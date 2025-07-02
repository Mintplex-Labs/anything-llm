# Google Drive Integration Setup

This guide will help you set up Google Drive integration with AnythingLLM for automatic document synchronization.

## Prerequisites

1. A Google Cloud Console account
2. Access to Google Drive folders you want to sync
3. Admin privileges in AnythingLLM

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click on it and press "Enable"

## Step 2: Create Service Account

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - **Name**: AnythingLLM Drive Sync (or your preferred name)
   - **Description**: Service account for syncing Google Drive with AnythingLLM
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Generate Service Account Key

1. In the "Credentials" page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Select "JSON" format
6. Click "Create" - this will download the JSON key file
7. **Keep this file secure** - it contains authentication credentials

## Step 4: Share Google Drive Folder

1. Open Google Drive and navigate to the folder you want to sync
2. Right-click the folder and select "Share"
3. Add the service account email (found in the JSON file as `client_email`) as a viewer
4. Make sure the permission is set to "Viewer" or "Editor" depending on your needs
5. Copy the folder ID from the URL (the string after `/folders/` in the URL)

Example URL: `https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
Folder ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 5: Configure AnythingLLM

1. Login to AnythingLLM as an admin
2. Go to Workspace Settings > Data Connectors
3. Select "Google Drive" from the list
4. Fill in the required information:
   - **Google Drive Folder ID**: The ID you copied in Step 4
   - **Service Account JSON File**: Upload the JSON file from Step 3
   - **Sync Frequency**: Choose how often to check for changes (hourly, daily, weekly)
   - **Enable automatic synchronization**: Check to enable background sync
   - **Include subfolders**: Check to sync nested folders

## Supported File Types

The Google Drive integration supports:

### Google Workspace Files
- Google Docs (exported as text)
- Google Sheets (exported as CSV)
- Google Slides (exported as text)

### Common Document Formats
- PDF files
- Microsoft Word (.docx, .doc)
- Microsoft Excel (.xlsx, .xls)
- Microsoft PowerPoint (.pptx, .ppt)
- Text files (.txt, .md, .html)
- CSV files

### Images (with OCR)
- JPEG, PNG, GIF, BMP, TIFF

## File Size Limits

- Maximum file size: 50MB per file
- Files larger than 50MB will be skipped

## Sync Features

### Automatic Sync
- Configurable frequency (hourly, daily, weekly)
- Incremental updates using Google Drive change tokens
- Only processes modified files

### Change Detection
- Detects new files
- Detects modified files
- Handles deleted files with archival system

### Archival System
- Deleted files are archived for 30-90 days (configurable)
- Archived files are excluded from search but retained for audit
- Automatic cleanup after retention period expires

## Troubleshooting

### Authentication Issues
- Verify the service account email has access to the folder
- Check that the Google Drive API is enabled
- Ensure the JSON key file is valid and not expired

### Sync Issues
- Check the AnythingLLM logs for error messages
- Verify folder permissions
- Ensure the folder ID is correct
- Check network connectivity to Google services

### Performance Considerations
- Large folders (>1000 files) may take longer on initial sync
- Consider using subfolders to organize content
- Monitor storage usage in AnythingLLM

## Security Best Practices

1. **Service Account Security**:
   - Keep the JSON key file secure
   - Use principle of least privilege (Viewer access when possible)
   - Regularly rotate service account keys

2. **Folder Permissions**:
   - Only share necessary folders with the service account
   - Use specific folder sharing rather than entire drives
   - Regular audit of shared folders

3. **Data Handling**:
   - Be aware of sensitive information in synced documents
   - Configure appropriate retention policies
   - Monitor archived documents

## Administrative Features

### Archive Management
- View archived documents in workspace settings
- Restore accidentally deleted documents
- Configure retention periods per workspace
- Manual purge of sensitive documents

### Monitoring
- Sync status in data connectors
- Archive statistics
- Failed sync reports
- Background job monitoring

## API Rate Limits

Google Drive API has usage quotas:
- 1,000 requests per 100 seconds per user
- 10,000 requests per 100 seconds

The integration handles rate limiting automatically with exponential backoff.

## Support

If you encounter issues:
1. Check the AnythingLLM logs
2. Verify Google Cloud Console settings
3. Test with a small folder first
4. Contact support with specific error messages 