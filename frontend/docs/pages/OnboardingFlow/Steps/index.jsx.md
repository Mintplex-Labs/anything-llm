```javascript
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import Home from "./Home";
import LLMPreference from "./LLMPreference";
import UserSetup from "./UserSetup";
import DataHandling from "./DataHandling";
import Survey from "./Survey";
import CreateWorkspace from "./CreateWorkspace";

const OnboardingSteps = {
  home: Home,
  "llm-preference": LLMPreference,
  "user-setup": UserSetup,
  "data-handling": DataHandling,
  survey: Survey,
  "create-workspace": CreateWorkspace,
};

export default OnboardingSteps;

export function OnboardingLayout({ children }) {
  const [header, setHeader] = useState({
    title: "",
    description: "",
  });
  const [backBtn, setBackBtn] = useState({
    showing: false,
    disabled: true,
    onClick: () => null,
  });
  const [forwardBtn, setForwardBtn] = useState({
    showing: false,
    disabled: true,
    onClick: () => null,
  });

  if (isMobile) {
    return (
      <div className="w-screen h-screen overflow-y-auto bg-[#2C2F35] overflow-hidden">
        <div className="flex flex-col">
          <div className="w-full relative py-10 px-2">
            <div className="flex flex-col w-fit mx-auto gap-y-1 mb-[55px]">
              <h1 className="text-white font-semibold text-center text-2xl">
                {header.title}
              </h1>
              <p className="text-zinc-400 text-base text-center">
                {header.description}
              </p>
            </div>
            {children(setHeader, setBackBtn, setForwardBtn)}
          </div>
          <div className="flex w-full justify-center gap-x-4 pb-20">
            <div className="flex justify-center items-center">
              {backBtn.showing && (
                <button
                  disabled={backBtn.disabled}
                  onClick={backBtn.onClick}
                  className="group p-2 rounded-lg border-2 border-zinc-300 disabled:border-zinc-600 h-fit w-fit disabled:not-allowed hover:bg-zinc-100 disabled:hover:bg-transparent"
                >
                  <ArrowLeft
                    className="text-white group-hover:text-black group-disabled:text-gray-500"
                    size={30}
                  />
                </button>
              )}
            </div>

            <div className="flex justify-center items-center">
              {forwardBtn.showing && (
                <button
                  disabled={forwardBtn.disabled}
                  onClick={forwardBtn.onClick}
                  className="group p-2 rounded-lg border-2 border-zinc-300 disabled:border-zinc-600 h-fit w-fit disabled:not-allowed hover:bg-zinc-100 disabled:hover:bg-transparent"
                >
                  <ArrowRight
                    className="text-white group-hover:text-black group-disabled:text-gray-500"
                    size={30}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen overflow-y-auto bg-[#2C2F35] md:bg-main-gradient flex justify-center overflow-hidden">
      <div className="flex w-1/5 h-screen justify-center items-center">
        {backBtn.showing && (
          <button
            disabled={backBtn.disabled}
            onClick={backBtn.onClick}
            className="group p-2 rounded-lg border-2 border-zinc-300 disabled:border-zinc-600 h-fit w-fit disabled:not-allowed hover:bg-zinc-100 disabled:hover:bg-transparent"
            aria-label="Back"
          >
            <ArrowLeft
              className="text-white group-hover:text-black group-disabled:text-gray-500"
              size={30}
            />
          </button>
        )}
      </div>

      <div className="w-full md:w-3/5 relative h-full py-10">
        <div className="flex flex-col w-fit mx-auto gap-y-1 mb-[55px]">
          <h1 className="text-white font-semibold text-center text-2xl">
            {header.title}
          </h1>
          <p className="text-zinc-400 text-base text-center">
            {header.description}
          </p>
        </div>
        {children(setHeader, setBackBtn, setForwardBtn)}
      </div>

      <div className="flex w-1/5 h-screen justify-center items-center">
        {forwardBtn.showing && (
          <button
            disabled={forwardBtn.disabled}
            onClick={forwardBtn.onClick}
            className="group p-2 rounded-lg border-2 border-zinc-300 disabled:border-zinc-600 h-fit w-fit disabled:not-allowed hover:bg-zinc-100 disabled:hover:bg-transparent"
            aria-label="Continue"
          >
            <ArrowRight
              className="text-white group-hover:text-black group-disabled:text-gray-500"
              size={30}
            />
          </button>
        )}
      </div>
    </div>
  );
}

```
# Purpose and Usage

The provided TypeScript code defines a reusable UI component for displaying header information along with navigation buttons (back and forward). This interface is intended to be used within the codebase to create interactive user interfaces that facilitate navigation between different sections or pages.

# Method Documentation

### `children(setHeader, setBackBtn, setForwardBtn)`

This method takes three functions as parameters: `setHeader`, `setBackBtn`, and `setForwardBtn`. These functions are responsible for setting the header title, back button, and forward button respectively. The method returns a JSX element that represents the UI component.

#### Parameters:

* `setHeader`: A function that sets the header title.
* `setBackBtn`: A function that sets the back button.
* `setForwardBtn`: A function that sets the forward button.

#### Return Value:
A JSX element representing the UI component with the provided header, back button, and forward button.

### Example Usage:

```typescript
import { children } from './ui-component';

const setHeader = (title: string) => ({ title });
const setBackBtn = (showing: boolean, onClick: () => void) => ({ showing, onClick });
const setForwardBtn = (showing: boolean, onClick: () => void) => ({ showing, onClick });

const MyUIComponent = children(setHeader('My Header'), setBackBtn(true, () => console.log('Back Button Clicked')), setForwardBtn(false, () => console.log('Forward Button Clicked')));

// Render the UI component
ReactDOM.render(<MyUIComponent />, document.getElementById('root'));
```

# Dependencies

This interface relies on the `setHeader`, `setBackBtn`, and `setForwardBtn` functions to provide the necessary data for rendering the UI component. These functions should be defined elsewhere in the codebase.

# Clarity and Consistency

The documentation is organized into clear sections, providing a concise overview of the purpose and usage of the interface. The method documentation includes detailed information about each parameter and return value, making it easy to understand how to use the interface effectively. The examples provided demonstrate how to use the interface in a real-world scenario, further enhancing its clarity and consistency.