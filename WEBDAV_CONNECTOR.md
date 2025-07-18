# WebDAV Connector for AnythingLLM

This document describes the WebDAV connector implementation for AnythingLLM, which allows users to import files directly from WebDAV servers.

## Overview

The WebDAV connector enables AnythingLLM to connect to WebDAV servers and import documents for processing and embedding. It supports:

- Authentication with username/password
- Recursive directory scanning
- File type filtering
- Support for common document formats

## Features

### Connection Settings
- **WebDAV URL**: The URL of your WebDAV server (e.g., `https://webdav.example.com`)
- **Username**: Your WebDAV username
- **Password**: Your WebDAV password
- **Path**: Starting directory path (default: `/`)
- **Recursive Collection**: Whether to scan subdirectories
- **File Types**: Filter which file types to import

### Supported File Types
- PDF Files (.pdf)
- Text Files (.txt)
- Markdown Files (.md)
- Word Documents (.docx)
- Excel Spreadsheets (.xlsx)
- CSV Files (.csv)
- HTML Files (.html)
- JSON Files (.json)
- XML Files (.xml)
- RTF Files (.rtf)

## Implementation Details

### Frontend Components

1. **Data Connector Model** (`frontend/src/models/dataConnector.js`)
   - API calls to backend for WebDAV operations

2. **UI Component** (`frontend/src/components/Modals/ManageWorkspace/DataConnectors/Connectors/WebDAV/index.jsx`)
   - Form interface for WebDAV connection settings
   - File type selection checkboxes
   - Connection status and error handling

3. **Connector Definition** (`frontend/src/components/Modals/ManageWorkspace/DataConnectors/index.jsx`)
   - Registers WebDAV connector in the connector list

4. **Localization** (`frontend/src/locales/en/common.js`)
   - User-facing text and descriptions

5. **Icon** (`frontend/src/components/DataConnectorOption/media/webdav.svg`)
   - WebDAV connector icon

### Backend Components

1. **API Endpoint** (`server/endpoints/extensions/index.js`)
   - Handles WebDAV API requests
   - Forwards requests to collector service

2. **Collector Endpoint** (`collector/extensions/index.js`)
   - Processes WebDAV requests
   - Calls WebDAV implementation

3. **WebDAV Implementation** (`collector/utils/extensions/WebDAV/index.js`)
   - Core WebDAV functionality
   - File discovery and processing
   - Document creation and storage

### Dependencies

- `webdav`: WebDAV client library for Node.js
- `uuid`: Unique identifier generation
- `slugify`: URL-safe filename creation

## Usage

1. Navigate to a workspace in AnythingLLM
2. Click "Manage Workspace"
3. Go to "Data Connectors" tab
4. Select "WebDAV" from the connector list
5. Fill in your WebDAV server details:
   - WebDAV URL
   - Username
   - Password
   - Path (optional)
   - Enable/disable recursive scanning
   - Select file types to import
6. Click "Connect to WebDAV"
7. Wait for the import to complete
8. Files will be available in the document picker

## Security Considerations

- Passwords are transmitted securely to the backend
- No credentials are stored permanently
- Connection is tested before file processing begins
- File access is limited to specified paths

## Error Handling

The connector handles various error scenarios:
- Invalid WebDAV URL
- Authentication failures
- Network connectivity issues
- File access permissions
- Empty or unsupported files

## File Processing

1. **Discovery**: Recursively scans WebDAV directories
2. **Filtering**: Only processes supported file types
3. **Download**: Retrieves file content from WebDAV server
4. **Processing**: Converts files to AnythingLLM document format
5. **Storage**: Saves processed documents to local storage
6. **Indexing**: Documents become available for embedding

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Verify WebDAV URL is correct
   - Check username and password
   - Ensure WebDAV server is accessible

2. **No Files Found**
   - Verify the specified path exists
   - Check file type filters
   - Ensure files have supported extensions

3. **Import Timeout**
   - Large directories may take time to process
   - Check network connectivity
   - Consider processing smaller batches

### Debug Information

The connector provides detailed logging:
- Connection attempts
- File discovery progress
- Processing status
- Error details

## Future Enhancements

Potential improvements for the WebDAV connector:
- Support for additional authentication methods
- Incremental sync capabilities
- File watching for real-time updates
- Advanced filtering options
- Performance optimizations for large directories 