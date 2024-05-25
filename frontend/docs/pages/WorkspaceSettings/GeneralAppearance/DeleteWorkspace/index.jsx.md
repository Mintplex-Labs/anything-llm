```javascript
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import System from "@/models/system";

export default function DeleteWorkspace({ workspace }) {
  const { slug } = useParams();
  const [deleting, setDeleting] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    async function fetchKeys() {
      const canDelete = await System.getCanDeleteWorkspaces();
      setCanDelete(canDelete);
    }
    fetchKeys();
  }, [workspace?.slug]);

  const deleteWorkspace = async () => {
    if (
      !window.confirm(
        `You are about to delete your entire ${workspace.name} workspace. This will remove all vector embeddings on your vector database.\n\nThe original source files will remain untouched. This action is irreversible.`
      )
    )
      return false;

    setDeleting(true);
    const success = await Workspace.delete(workspace.slug);
    if (!success) {
      showToast("Workspace could not be deleted!", "error", { clear: true });
      setDeleting(false);
      return;
    }

    workspace.slug === slug
      ? (window.location = paths.home())
      : window.location.reload();
  };

  if (!canDelete) return null;
  return (
    <button
      disabled={deleting}
      onClick={deleteWorkspace}
      type="button"
      className="w-60 mt-[40px] transition-all duration-300 border border-transparent rounded-lg whitespace-nowrap text-sm px-5 py-2.5 focus:z-10 bg-red-500/25 text-red-200 hover:text-white hover:bg-red-600 disabled:bg-red-600 disabled:text-red-200 disabled:animate-pulse"
    >
      {deleting ? "Deleting Workspace..." : "Delete Workspace"}
    </button>
  );
}

```
**DeleteWorkspace Interface Documentation**

### Purpose and Usage

The `DeleteWorkspace` interface is a React component responsible for deleting a workspace. Its primary purpose is to provide a user-friendly interface for deleting a workspace, ensuring that users are properly warned about the irreversible nature of this action.

### Method Documentation

#### `fetchKeys`

* Signature: `async function fetchKeys()`
* Purpose: Fetches the can-delete workspaces status from the System model.
* Parameters: None
* Return Type: `boolean`
* Description: This method checks if the user has permission to delete a workspace. It calls the `getCanDeleteWorkspaces` method of the System model and sets the `canDelete` state variable accordingly.

#### `deleteWorkspace`

* Signature: `async function deleteWorkspace() => Promise<void>`
* Purpose: Deletes a workspace when the user confirms the deletion.
* Parameters: None
* Return Type: `void`
* Description: This method is called when the user clicks the "Delete Workspace" button. It first checks if the user has confirmed the deletion using a window.confirm dialog. If confirmed, it sets the `deleting` state variable to true and calls the `delete` method of the Workspace model with the workspace's slug as an argument. If the deletion is successful, it reloads the page or navigates to the home path.

### Examples

To use the `DeleteWorkspace` interface, you can render it in a React component:
```jsx
import React from 'react';
import DeleteWorkspace from './DeleteWorkspace';

function MyComponent() {
  return (
    <div>
      <h2>Delete Workspace</h2>
      <DeleteWorkspace workspace={myWorkspace} />
    </div>
  );
}
```
### Dependencies

The `DeleteWorkspace` interface depends on the following components and models:

* `react`: The React library for building user interfaces.
* `react-router-dom`: A library for managing client-side routing in React applications.
* `@/models/workspace`: A model representing a workspace.
* `@/models/system`: A model providing system-level functionality, such as checking permissions.
* `@/utils/paths`: A utility library for working with paths and URLs.

### Clarity and Consistency

The documentation for this interface aims to provide clear and concise descriptions of each method, parameter, and return type. It also highlights the dependencies and relationships between components and models, ensuring that users can easily understand how to use the `DeleteWorkspace` interface in their React applications.