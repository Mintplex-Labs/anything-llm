# Azure DevOps Organization Loading

This document describes how to use the new Azure DevOps organization-wide loading feature in anything-llm.

## Overview

The Azure DevOps organization loader allows you to automatically discover and load all projects and repositories within an Azure DevOps organization, eliminating the need to specify each repository individually.

## Features

- **Auto-discovery**: Automatically finds all projects and repositories in an organization
- **Filtering**: Include/exclude specific projects or repositories
- **Bulk loading**: Loads all repositories in a single operation
- **Auto-resync**: Supports automatic resyncing of all loaded content
- **Progress tracking**: Provides detailed progress and error reporting

## API Endpoints

### Load Entire Organization
```
POST /ext/azuredevops-organization
```

#### Request Body

```json
{
  "organization": "your-organization-name",
  "accessToken": "your-personal-access-token",
  "includeProjects": ["project1", "project2"],
  "excludeProjects": ["temp-project"],
  "includeRepositories": ["important-repo"],
  "excludeRepositories": ["archived-repo", "temp-repo"],
  "ignorePaths": [".git", "node_modules", "*.log"]
}
```

#### Parameters

- **organization** (required): The Azure DevOps organization name
- **accessToken** (optional): Azure DevOps Personal Access Token for private repositories
- **includeProjects** (optional): Array of specific project names to include (loads all if not specified)
- **excludeProjects** (optional): Array of project names to exclude
- **includeRepositories** (optional): Array of specific repository names to include (loads all if not specified)
- **excludeRepositories** (optional): Array of repository names to exclude
- **ignorePaths** (optional): Array of file/folder patterns to ignore

#### Response

```json
{
  "success": true,
  "reason": null,
  "data": {
    "organization": "your-organization",
    "projects": ["project1", "project2", "project3"],
    "totalRepositories": 15,
    "successfulRepositories": 14,
    "failedRepositories": 1,
    "files": 450,
    "destination": "your-organization-organization",
    "results": [
      {
        "success": true,
        "repository": {
          "id": "repo-id",
          "name": "repo-name",
          "projectName": "project-name",
          "remoteUrl": "https://dev.azure.com/org/project/_git/repo"
        },
        "reason": null,
        "files": 25
      }
    ]
  }
}
```

## Usage Examples

### Load Entire Organization

```bash
curl -X POST http://localhost:8888/ext/azuredevops-organization \
  -H "Content-Type: application/json" \
  -d '{
    "organization": "mycompany",
    "accessToken": "your-pat-token"
  }'
```

### Load Specific Projects Only

```bash
curl -X POST http://localhost:8888/ext/azuredevops-organization \
  -H "Content-Type: application/json" \
  -d '{
    "organization": "mycompany",
    "accessToken": "your-pat-token",
    "includeProjects": ["web-app", "mobile-app"]
  }'
```

### Exclude Archived Projects

```bash
curl -X POST http://localhost:8888/ext/azuredevops-organization \
  -H "Content-Type: application/json" \
  -d '{
    "organization": "mycompany",
    "accessToken": "your-pat-token",
    "excludeProjects": ["legacy-project", "archived-project"]
  }'
```

### Filter Repositories

```bash
curl -X POST http://localhost:8888/ext/azuredevops-organization \
  -H "Content-Type: application/json" \
  -d '{
    "organization": "mycompany",
    "accessToken": "your-pat-token",
    "includeRepositories": ["main-repo", "docs-repo"],
    "excludeRepositories": ["temp-repo", "experimental"]
  }'
```

## Authentication

### Personal Access Token (PAT)

To access private repositories, you'll need a Personal Access Token with the following permissions:

- **Code (read)**: Required to read source code and repository information
- **Project and Team (read)**: Required to list projects in the organization

### Creating a PAT

1. Go to your Azure DevOps organization
2. Click on your profile picture → Personal access tokens
3. Click "New Token"
4. Set the following:
   - Name: "AnythingLLM Integration"
   - Organization: Select your organization
   - Scopes: Custom defined
   - Code: Read
   - Project and Team: Read
5. Click "Create"
6. Copy the token immediately (it won't be shown again)

## Organization URL Formats

The organization loader works with organization names, not full URLs. Just provide the organization name:

- ✅ **Correct**: `"mycompany"`
- ❌ **Incorrect**: `"https://dev.azure.com/mycompany"`
- ❌ **Incorrect**: `"https://mycompany.visualstudio.com"`

The loader automatically constructs the appropriate API URLs using the `dev.azure.com` format.

## Filtering Guidelines

### Project Filtering

- Use `includeProjects` when you only want specific projects
- Use `excludeProjects` when you want most projects except a few
- Project names are case-sensitive
- You cannot use both `includeProjects` and `excludeProjects` together (include takes precedence)

### Repository Filtering

- Use `includeRepositories` when you only want specific repositories across all projects
- Use `excludeRepositories` when you want most repositories except a few
- Repository names are case-sensitive
- Filtering applies across all projects
- You cannot use both `includeRepositories` and `excludeRepositories` together (include takes precedence)

## Auto-Resync

Once loaded, all documents from the organization will automatically participate in the resync process if enabled. The system will:

- Track changes to all loaded repositories
- Automatically update content when files change
- Maintain the organization structure in the document metadata

## Error Handling

The loader provides detailed error reporting:

- **Organization level**: Invalid organization name or access token
- **Project level**: Projects that couldn't be accessed
- **Repository level**: Repositories that failed to load
- **File level**: Individual files that couldn't be processed

All errors are logged and included in the response for troubleshooting.

## Performance Considerations

- **Large organizations**: Loading very large organizations may take considerable time
- **Rate limiting**: Azure DevOps API has rate limits; the loader includes appropriate delays
- **Memory usage**: Large organizations with many files may require significant memory
- **Storage space**: Ensure adequate disk space for all loaded documents

## Troubleshooting

### Common Issues

1. **"Organization not found"**
   - Verify the organization name is correct
   - Ensure your PAT has access to the organization

2. **"No projects found"**
   - Check if your PAT has Project and Team (read) permissions
   - Verify the organization has projects you can access

3. **"No repositories found"**
   - Check if your PAT has Code (read) permissions
   - Verify the projects contain Git repositories

4. **"Authentication failed"**
   - Regenerate your Personal Access Token
   - Ensure the token hasn't expired

### Debug Information

The loader provides extensive logging. Check the collector logs for detailed information about:

- Organization validation
- Project discovery
- Repository enumeration
- File processing
- Error details

## Migration from Individual Repository Loading

If you're currently loading individual repositories, you can migrate to organization loading:

1. Note your current repository URLs
2. Extract the organization name from the URLs
3. Use the organization loader with appropriate filters if needed
4. Remove individual repository configurations

The organization loader will discover and load all your existing repositories automatically.
