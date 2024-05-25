```javascript
import { useRef, useState } from "react";
import { DotsThreeOutline, LinkSimple } from "@phosphor-icons/react";
import showToast from "@/utils/toast";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import Embed from "@/models/embed";
import paths from "@/utils/paths";
import { nFormatter } from "@/utils/numbers";
import EditEmbedModal from "./EditEmbedModal";
import CodeSnippetModal from "./CodeSnippetModal";

export default function EmbedRow({ embed }) {
  const rowRef = useRef(null);
  const [enabled, setEnabled] = useState(Number(embed.enabled) === 1);
  const {
    isOpen: isSettingsOpen,
    openModal: openSettingsModal,
    closeModal: closeSettingsModal,
  } = useModal();
  const {
    isOpen: isSnippetOpen,
    openModal: openSnippetModal,
    closeModal: closeSnippetModal,
  } = useModal();

  const handleSuspend = async () => {
    if (
      !window.confirm(
        `Are you sure you want to disabled this embed?\nOnce disabled the embed will no longer respond to any chat requests.`
      )
    )
      return false;

    const { success, error } = await Embed.updateEmbed(embed.id, {
      enabled: !enabled,
    });
    if (!success) showToast(error, "error", { clear: true });
    if (success) {
      showToast(
        `Embed ${enabled ? "has been disabled" : "is active"}.`,
        "success",
        { clear: true }
      );
      setEnabled(!enabled);
    }
  };
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete this embed?\nOnce deleted this embed will no longer respond to chats or be active.\n\nThis action is irreversible.`
      )
    )
      return false;
    const { success, error } = await Embed.deleteEmbed(embed.id);
    if (!success) showToast(error, "error", { clear: true });
    if (success) {
      rowRef?.current?.remove();
      showToast("Embed deleted from system.", "success", { clear: true });
    }
  };

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-sm"
      >
        <th
          scope="row"
          className="px-6 py-4 whitespace-nowrap flex item-center gap-x-1"
        >
          <a
            href={paths.workspace.chat(embed.workspace.slug)}
            target="_blank"
            rel="noreferrer"
            className="text-white flex items-center hover:underline"
          >
            <LinkSimple className="mr-2 w-5 h-5" /> {embed.workspace.name}
          </a>
        </th>
        <th scope="row" className="px-6 py-4 whitespace-nowrap">
          {nFormatter(embed._count.embed_chats)}
        </th>
        <th scope="row" className="px-6 py-4 whitespace-nowrap">
          <ActiveDomains domainList={embed.allowlist_domains} />
        </th>
        <td className="px-6 py-4 flex items-center gap-x-6">
          <button
            onClick={openSettingsModal}
            className="font-medium text-white text-opacity-80 rounded-lg hover:text-white px-2 py-1 hover:text-opacity-60 hover:bg-white hover:bg-opacity-10"
          >
            <DotsThreeOutline weight="fill" className="h-5 w-5" />
          </button>
          <>
            <button
              onClick={openSnippetModal}
              className="font-medium text-blue-600 dark:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-50 hover:dark:bg-blue-800 hover:dark:bg-opacity-20"
            >
              Show Code
            </button>
            <button
              onClick={handleSuspend}
              className="font-medium text-orange-600 dark:text-orange-300 px-2 py-1 rounded-lg hover:bg-orange-50 hover:dark:bg-orange-800 hover:dark:bg-opacity-20"
            >
              {enabled ? "Disable" : "Enable"}
            </button>
            <button
              onClick={handleDelete}
              className="font-medium text-red-600 dark:text-red-300 px-2 py-1 rounded-lg hover:bg-red-50 hover:dark:bg-red-800 hover:dark:bg-opacity-20"
            >
              Delete
            </button>
          </>
        </td>
      </tr>
      <ModalWrapper isOpen={isSettingsOpen}>
        <EditEmbedModal embed={embed} closeModal={closeSettingsModal} />
      </ModalWrapper>
      <ModalWrapper isOpen={isSnippetOpen}>
        <CodeSnippetModal embed={embed} closeModal={closeSnippetModal} />
      </ModalWrapper>
    </>
  );
}

function ActiveDomains({ domainList }) {
  if (!domainList) return <p>all</p>;
  try {
    const domains = JSON.parse(domainList);
    return (
      <div className="flex flex-col gap-y-2">
        {domains.map((domain) => {
          return <p className="font-mono !font-normal">{domain}</p>;
        })}
      </div>
    );
  } catch {
    return <p>all</p>;
  }
}

```
**Interface Documentation**

### Purpose and Usage:

The provided interface is a React component responsible for rendering an embed row in a table. The purpose of this component is to display essential information about an embed, such as its workspace name, chat count, allowed domains, and enable/disable status. The interface also provides buttons for opening settings, snippet modal, disabling/ enabling the embed, and deleting it.

### Method Documentation:

#### `handleSuspend`

* Signature: `async () => { ... }`
* Purpose: Disable or enable an embed.
* Parameters:
	+ None
* Return value: N/A ( asynchronous operation )
* Description: This method updates the enabled status of the embed. It prompts the user to confirm the action and, if successful, shows a success message.

#### `handleDelete`

* Signature: `async () => { ... }`
* Purpose: Delete an embed.
* Parameters:
	+ None
* Return value: N/A ( asynchronous operation )
* Description: This method deletes the embed from the system. It prompts the user to confirm the action and, if successful, shows a success message.

#### `openSettingsModal`

* Signature: `() => { ... }`
* Purpose: Open the settings modal for the current embed.
* Parameters:
	+ None
* Return value: N/A ( opens a new modal )
* Description: This method opens the settings modal, allowing users to edit the embed's properties.

#### `openSnippetModal`

* Signature: `() => { ... }`
* Purpose: Open the snippet modal for the current embed.
* Parameters:
	+ None
* Return value: N/A ( opens a new modal )
* Description: This method opens the snippet modal, displaying the embed's code.

### Examples:

To use this interface, you would typically render it within your React application and pass in an `embed` object as a prop. The following example demonstrates this:
```jsx
import React from 'react';
import EmbedRow from './EmbedRow';

const App = () => {
  const embed = { /* some embedded data */ };

  return (
    <table>
      <tbody>
        <tr>
          <td>
            <EmbedRow embed={embed} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};
```
### Dependencies:

This interface relies on the `Embed` class, which is not shown in this code snippet. The `Embed` class likely provides methods for updating and deleting an embed.

### Clarity and Consistency:

The provided code is well-organized and easy to understand. The method signatures are clearly defined, and the purpose of each method is clearly stated. The use of React hooks (e.g., `useState`) is consistent throughout the code.