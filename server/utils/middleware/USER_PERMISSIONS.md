# User Permissions in AnythingLLM

AnythingLLM supports a powerful role-based permission system when running in multi-user mode. This document explains the different permission types available and how to manage them.

## Role Types

Users in AnythingLLM can have one of the following roles:

- **Admin**: Full system access, can manage all users, workspaces, and settings
- **Manager**: Can manage workspaces and upload documents
- **Default**: Regular user with limited permissions

## Document Upload Permissions

By default, only admin and manager roles can upload documents to workspaces. However, AnythingLLM supports granting document upload permissions to regular users.

### Enabling Document Upload for Regular Users

As an admin, you can enable document upload permissions for regular users:

1. Navigate to the Admin panel
2. Select "Users" from the sidebar
3. Click the edit icon next to a user with the "default" role
4. In the user edit modal, you'll see a "Document Upload Permissions" section
5. Toggle "Can upload documents" to enable this permission
6. Set a document upload limit (maximum number of documents the user can upload)
7. Save the changes

### Document Upload Quota

When enabling document upload for a regular user, you can set a quota to limit the maximum number of documents they can upload:

- Set a specific number (e.g., 10, 50, 100)
- Leave empty for unlimited uploads (same as admin/manager)

### Technical Implementation

The document upload permission system consists of:

1. Database fields in the User model:

   - `canUploadDocuments` (boolean): Permission flag
   - `documentUploadLimit` (integer): Maximum number of documents this user can upload

2. Middleware to enforce permissions:

   - `canUploadDocuments` middleware checks both the permission flag and quota

3. Tracking of document ownership:
   - Each document is linked to the user who uploaded it
   - A count is maintained to enforce the quota

### API Endpoints

The document upload permission is enforced on all document-related endpoints:

- `/workspace/:slug/upload-and-embed`
- `/workspace/:slug/upload`
- `/workspace/:slug/upload-link`
- `/workspace/:slug/update-embeddings`
- `/workspace/:slug/remove-and-unembed`

## Managing Permissions

Only administrators can modify user permissions. The permission settings are found in the user management section of the admin panel.

## Security Considerations

- Even with document upload permissions, regular users can only upload to workspaces they have access to
- Document upload permissions do not grant workspace creation/management permissions
- All uploaded documents go through the same content validation process regardless of user role
