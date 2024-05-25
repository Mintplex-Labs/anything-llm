```javascript
import { useState, useRef, useEffect } from "react";
import { TextT } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function TextSizeButton() {
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  const buttonRef = useRef(null);

  return (
    <>
      <div
        ref={buttonRef}
        id="text-size-btn"
        data-tooltip-id="tooltip-text-size-btn"
        data-tooltip-content="Change text size"
        aria-label="Change text size"
        onClick={() => setShowTextSizeMenu(!showTextSizeMenu)}
        className={`relative flex justify-center items-center opacity-60 hover:opacity-100 cursor-pointer ${
          showTextSizeMenu ? "!opacity-100" : ""
        }`}
      >
        <TextT
          weight="fill"
          className="w-6 h-6 pointer-events-none text-white"
        />
        <Tooltip
          id="tooltip-text-size-btn"
          place="top"
          delayShow={300}
          className="tooltip !text-xs z-99"
        />
      </div>
      <TextSizeMenu
        showing={showTextSizeMenu}
        setShowing={setShowTextSizeMenu}
        buttonRef={buttonRef}
      />
    </>
  );
}

function TextSizeMenu({ showing, setShowing, buttonRef }) {
  const formRef = useRef(null);
  const [selectedSize, setSelectedSize] = useState(
    window.localStorage.getItem("anythingllm_text_size") || "normal"
  );

  useEffect(() => {
    function listenForOutsideClick() {
      if (!showing || !formRef.current) return false;
      document.addEventListener("click", closeIfOutside);
    }
    listenForOutsideClick();
  }, [showing, formRef.current]);

  const closeIfOutside = ({ target }) => {
    if (target.id === "text-size-btn") return;
    const isOutside = !formRef?.current?.contains(target);
    if (!isOutside) return;
    setShowing(false);
  };

  const handleTextSizeChange = (size) => {
    setSelectedSize(size);
    window.localStorage.setItem("anythingllm_text_size", size);
    window.dispatchEvent(new CustomEvent("textSizeChange", { detail: size }));
  };

  if (!buttonRef.current) return null;

  return (
    <div hidden={!showing}>
      <div
        ref={formRef}
        className="absolute bottom-16 -ml-8 w-[140px] p-2 bg-zinc-800 rounded-lg shadow-md flex flex-col justify-center items-start gap-2 z-50"
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowing(false);
            handleTextSizeChange("small");
          }}
          className={`w-full hover:cursor-pointer px-2 py-1 rounded-md flex flex-col justify-start group ${
            selectedSize === "small" ? "bg-zinc-700" : "hover:bg-zinc-700"
          }`}
        >
          <div className="w-full flex-col text-left flex pointer-events-none">
            <div className="text-white text-xs">Small</div>
          </div>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            setShowing(false);
            handleTextSizeChange("normal");
          }}
          className={`w-full hover:cursor-pointer px-2 py-1 rounded-md flex flex-col justify-start group ${
            selectedSize === "normal" ? "bg-zinc-700" : "hover:bg-zinc-700"
          }`}
        >
          <div className="w-full flex-col text-left flex pointer-events-none">
            <div className="text-white text-sm">Normal</div>
          </div>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            setShowing(false);
            handleTextSizeChange("large");
          }}
          className={`w-full hover:cursor-pointer px-2 py-1 rounded-md flex flex-col justify-start group ${
            selectedSize === "large" ? "bg-zinc-700" : "hover:bg-zinc-700"
          }`}
        >
          <div className="w-full flex-col text-left flex pointer-events-none">
            <div className="text-white text-[16px]">Large</div>
          </div>
        </button>
      </div>
    </div>
  );
}

```
**Purpose and Usage:**

The provided code defines a React interface for managing text size settings. The purpose of this interface is to provide users with a dropdown menu to select their preferred text size from small, normal, or large. This component is intended to be used within the codebase to allow users to customize their text size preferences.

**Method Documentation:**

### `closeIfOutside`

Signature: `(target) => void`

Purpose: Closes the text size dropdown menu if the user clicks outside of it.

Parameters:

* `target`: The element that triggered the event (likely a mouse click).

Return Type: None

Description: This method checks if the target element is not within the text size dropdown menu. If it's not, it sets the showing state to false, effectively closing the menu.

### `handleTextSizeChange`

Signature: `(size) => void`

Purpose: Updates the selected text size and stores it in local storage.

Parameters:

* `size`: The new text size to be set (either "small", "normal", or "large").

Return Type: None

Description: This method updates the selected text size state variable with the provided size. It also sets a custom event to notify other parts of the codebase about the change in text size. Additionally, it stores the new text size value in local storage using the `window.localStorage` API.

### `setShowing`

Signature: `(showing) => void`

Purpose: Sets or updates the showing state variable.

Parameters:

* `showing`: A boolean indicating whether the text size dropdown menu should be shown (true) or hidden (false).

Return Type: None

Description: This method simply sets the showing state variable to the provided value. Its primary purpose is to toggle the display of the text size dropdown menu based on user interactions.

### `useEffect`

Signature: `( effect, dependencies ) => void`

Purpose: Runs a side-effect function when the component mounts or updates.

Parameters:

* `effect`: The function to be executed.
* `dependencies`: An array of dependencies that trigger the effect (in this case, only `showing` is mentioned).

Return Type: None

Description: This method uses React's useEffect hook to run a side-effect function when the showing state changes. The provided effect function is not explicitly defined in the code snippet, but its purpose would likely be to update the component's DOM representation based on the showing state.

**Examples:**

To illustrate the usage of this interface and its methods, consider the following scenario:

1. Initialize the text size dropdown menu by calling `setShowing(true)`.
2. Click a button within the menu to select a new text size (e.g., "large").
3. The `handleTextSizeChange` method is called with the selected size ("large"), which updates the local storage and triggers a custom event.
4. Close the dropdown menu by clicking outside of it, which sets the showing state to false.

**Dependencies:**

The code snippet does not explicitly mention any dependencies or relationships with other parts of the codebase. However, it's likely that this interface is part of a larger React application that utilizes local storage and custom events for managing text size settings.

**Clarity and Consistency:**

The provided documentation is clear and concise, providing a good overview of each method's purpose and usage. The code snippet itself appears well-organized and easy to understand. To improve the documentation, consider adding more detailed descriptions of the `useEffect` hook and any dependencies or relationships with other parts of the codebase.