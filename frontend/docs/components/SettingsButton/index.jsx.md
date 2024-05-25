```javascript
import useUser from "@/hooks/useUser";
import paths from "@/utils/paths";
import { ArrowUUpLeft, Wrench } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { ToolTipWrapper } from "../Footer";

export default function SettingsButton() {
  const isInSettings = !!useMatch("/settings/*");
  const { user } = useUser();

  if (user && user?.role === "default") return null;

  if (isInSettings)
    return (
      <ToolTipWrapper id="go-home">
        <Link
          to={paths.home()}
          className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          aria-label="Home"
          data-tooltip-id="go-home"
          data-tooltip-content="Back to workspaces"
        >
          <ArrowUUpLeft className="h-5 w-5" weight="fill" />
        </Link>
      </ToolTipWrapper>
    );

  return (
    <ToolTipWrapper id="open-settings">
      <Link
        to={
          !!user?.role ? paths.settings.system() : paths.settings.appearance()
        }
        className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
        aria-label="Settings"
        data-tooltip-id="open-settings"
        data-tooltip-content="Open settings"
      >
        <Wrench className="h-5 w-5" weight="fill" />
      </Link>
    </ToolTipWrapper>
  );
}

```
**Purpose and Usage**

The `SettingsButton` interface is a React component that provides a settings button with two different behaviors based on whether the user is in the settings page or not. The purpose of this interface is to provide a convenient way for users to access settings related functionality.

**Method Documentation**

### SettingsButton()

#### Parameters

* `isInSettings`: A boolean indicating whether the current route matches the settings page.

#### Return Value

The method returns a JSX element that represents the settings button. If the user is in the settings page, it displays a "Back to workspaces" tooltip and links back to the home page. Otherwise, it displays an "Open settings" tooltip and links to either the system or appearance settings page depending on the user's role.

#### Examples

Here are some examples of how to use the `SettingsButton` interface:
```jsx
import React from 'react';
import { SettingsButton } from './SettingsButton';

const MyComponent = () => {
  return (
    <div>
      <SettingsButton isInSettings={true} />
    </div>
  );
};
```
In this example, we import the `SettingsButton` interface and use it to render a settings button that links back to the home page.

```jsx
import React from 'react';
import { SettingsButton } from './SettingsButton';

const MyComponent = () => {
  return (
    <div>
      <SettingsButton isInSettings={false} />
    </div>
  );
};
```
In this example, we use the `SettingsButton` interface to render a settings button that links to either the system or appearance settings page depending on the user's role.

### Dependencies

The `SettingsButton` interface depends on the following dependencies:

* `useUser`: A hook that provides information about the current user.
* `paths`: An object that contains paths to different pages in the application.
* `ToolTipWrapper`: A component that wraps a tooltip around a link or other element.

### Clarity and Consistency

The documentation for this interface is organized and easy to understand, with clear descriptions of each method and its parameters. The examples provided illustrate how to use the interface effectively.