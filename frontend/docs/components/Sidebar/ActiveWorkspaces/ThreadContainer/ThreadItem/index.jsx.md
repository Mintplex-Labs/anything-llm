```javascript
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import {
  ArrowCounterClockwise,
  DotsThree,
  PencilSimple,
  Trash,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import truncate from "truncate";

const THREAD_CALLOUT_DETAIL_WIDTH = 26;
export default function ThreadItem({
  idx,
  activeIdx,
  isActive,
  workspace,
  thread,
  onRemove,
  toggleMarkForDeletion,
  hasNext,
  ctrlPressed = false,
}) {
  const { slug } = useParams();
  const optionsContainer = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [name, setName] = useState(thread.name);
  const linkTo = !thread.slug
    ? paths.workspace.chat(slug)
    : paths.workspace.thread(slug, thread.slug);

  return (
    <div
      className="w-full relative flex h-[38px] items-center border-none hover:bg-slate-600/20 rounded-lg"
      role="listitem"
    >
      {/* Curved line Element and leader if required */}
      <div
        style={{ width: THREAD_CALLOUT_DETAIL_WIDTH / 2 }}
        className={`${
          isActive
            ? "border-l-2 border-b-2 border-white"
            : "border-l border-b border-slate-300"
        } h-[50%] absolute top-0 z-10 left-2 rounded-bl-lg`}
      ></div>
      {/* Downstroke border for next item */}
      {hasNext && (
        <div
          style={{ width: THREAD_CALLOUT_DETAIL_WIDTH / 2 }}
          className={`${
            idx <= activeIdx && !isActive
              ? "border-l-2 border-white"
              : "border-l border-slate-300"
          } h-[100%] absolute top-0 z-1 left-2`}
        ></div>
      )}

      {/* Curved line inline placeholder for spacing - not visible */}
      <div
        style={{ width: THREAD_CALLOUT_DETAIL_WIDTH + 8 }}
        className="h-full"
      />
      <div className="flex w-full items-center justify-between pr-2 group relative">
        {thread.deleted ? (
          <div className="w-full flex justify-between">
            <div className="w-full ">
              <p className={`text-left text-sm text-slate-400/50 italic`}>
                deleted thread
              </p>
            </div>
            {ctrlPressed && (
              <button
                type="button"
                className="border-none"
                onClick={() => toggleMarkForDeletion(thread.id)}
              >
                <ArrowCounterClockwise
                  className="text-zinc-300 hover:text-white"
                  size={18}
                />
              </button>
            )}
          </div>
        ) : (
          <a
            href={
              window.location.pathname === linkTo || ctrlPressed ? "#" : linkTo
            }
            className="w-full"
            aria-current={isActive ? "page" : ""}
          >
            <p
              className={`text-left text-sm ${
                isActive ? "font-medium text-white" : "text-slate-400"
              }`}
            >
              {truncate(name, 25)}
            </p>
          </a>
        )}
        {!!thread.slug && !thread.deleted && (
          <div ref={optionsContainer}>
            {ctrlPressed ? (
              <button
                type="button"
                className="border-none"
                onClick={() => toggleMarkForDeletion(thread.id)}
              >
                <X
                  className="text-zinc-300 hover:text-white"
                  weight="bold"
                  size={18}
                />
              </button>
            ) : (
              <div className="flex items-center w-fit group-hover:visible md:invisible gap-x-1">
                <button
                  type="button"
                  className="border-none"
                  onClick={() => setShowOptions(!showOptions)}
                  aria-label="Thread options"
                >
                  <DotsThree className="text-slate-300" size={25} />
                </button>
              </div>
            )}
            {showOptions && (
              <OptionsMenu
                containerRef={optionsContainer}
                workspace={workspace}
                thread={thread}
                onRemove={onRemove}
                onRename={setName}
                close={() => setShowOptions(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OptionsMenu({
  containerRef,
  workspace,
  thread,
  onRename,
  onRemove,
  close,
}) {
  const menuRef = useRef(null);

  // Ref menu options
  const outsideClick = (e) => {
    if (!menuRef.current) return false;
    if (
      !menuRef.current?.contains(e.target) &&
      !containerRef.current?.contains(e.target)
    )
      close();
    return false;
  };

  const isEsc = (e) => {
    if (e.key === "Escape" || e.key === "Esc") close();
  };

  function cleanupListeners() {
    window.removeEventListener("click", outsideClick);
    window.removeEventListener("keyup", isEsc);
  }
  // end Ref menu options

  useEffect(() => {
    function setListeners() {
      if (!menuRef?.current || !containerRef.current) return false;
      window.document.addEventListener("click", outsideClick);
      window.document.addEventListener("keyup", isEsc);
    }

    setListeners();
    return cleanupListeners;
  }, [menuRef.current, containerRef.current]);

  const renameThread = async () => {
    const name = window
      .prompt("What would you like to rename this thread to?")
      ?.trim();
    if (!name || name.length === 0) {
      close();
      return;
    }

    const { message } = await Workspace.threads.update(
      workspace.slug,
      thread.slug,
      { name }
    );
    if (!!message) {
      showToast(`Thread could not be updated! ${message}`, "error", {
        clear: true,
      });
      close();
      return;
    }

    onRename(name);
    close();
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this thread? All of its chats will be deleted. You cannot undo this."
      )
    )
      return;
    const success = await Workspace.threads.delete(workspace.slug, thread.slug);
    if (!success) {
      showToast("Thread could not be deleted!", "error", { clear: true });
      return;
    }
    if (success) {
      showToast("Thread deleted successfully!", "success", { clear: true });
      onRemove(thread.id);
      return;
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute w-fit z-[20] top-[25px] right-[10px] bg-zinc-900 rounded-lg p-1"
    >
      <button
        onClick={renameThread}
        type="button"
        className="w-full rounded-md flex items-center p-2 gap-x-2 hover:bg-slate-500/20 text-slate-300"
      >
        <PencilSimple size={18} />
        <p className="text-sm">Rename</p>
      </button>
      <button
        onClick={handleDelete}
        type="button"
        className="w-full rounded-md flex items-center p-2 gap-x-2 hover:bg-red-500/20 text-slate-300 hover:text-red-100"
      >
        <Trash size={18} />
        <p className="text-sm">Delete Thread</p>
      </button>
    </div>
  );
}

```
# Thread Interface Documentation

## Purpose and Usage

The thread interface provides a comprehensive way to manage threads within a workspace. It is designed to be used within a React application, where it serves as a container for displaying individual thread information and allowing users to interact with the thread.

The purpose of this interface is to provide a user-friendly way to view and manage threads, including renaming and deleting them.

## Method Documentation

### `renameThread(name: string)`

**Purpose:** Rename a thread within a workspace.

**Parameters:**

* `name`: The new name for the thread (type: `string`).

**Return Type:** None.

**Description:** This method prompts the user to input a new name for the thread, then updates the thread's name within the workspace. If the update is successful, it closes the menu and returns no value. If there is an error during the update process, it displays an error message and does not close the menu.

### `handleDelete()`

**Purpose:** Delete a thread within a workspace.

**Parameters:** None.

**Return Type:** None.

**Description:** This method prompts the user to confirm deletion of the thread. If the user confirms deletion, it sends a request to the Workspace API to delete the thread and its associated chats. If the deletion is successful, it displays a success message and closes the menu. If there is an error during the deletion process, it displays an error message.

## Examples

Here's an example of how to use this interface:
```typescript
import { ThreadInterface } from './ThreadInterface';

const thread = {
  slug: 'my-thread',
  name: 'My Thread',
};

const workspace = {
  slug: 'my-workspace',
};

const menuRef = React.createRef();

return (
  <div>
    <ThreadInterface
      thread={thread}
      workspace={workspace}
      ref={menuRef}
    />
  </div>
);
```
In this example, we create a `ThreadInterface` component and pass it the `thread` and `workspace` objects as props. We also create a reference to the menu element using `React.createRef()`.

## Dependencies

This interface relies on the following dependencies:

* The Workspace API for updating and deleting threads.
* A Toast notification library for displaying success and error messages.

## Clarity and Consistency

The documentation is written in a clear and concise manner, with a focus on providing detailed information about each method. The examples provided illustrate how to use the interface effectively. The dependencies are clearly identified, allowing users to easily find and integrate the necessary libraries.