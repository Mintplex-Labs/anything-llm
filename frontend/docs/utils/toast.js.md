```javascript
import { toast } from "react-toastify";
import usePrefersDarkMode from "@/hooks/usePrefersDarkMode";

// Additional Configs (opts)
// You can also pass valid ReactToast params to override the defaults.
// clear: false, // Will dismiss all visible toasts before rendering next toast
const showToast = (message, type = "default", opts = {}) => {
  const prefersDarkMode = usePrefersDarkMode();
  const options = {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: prefersDarkMode ? "dark" : "light",
    ...opts,
  };

  if (opts?.clear === true) toast.dismiss();

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warn(message, options);
      break;
    default:
      toast(message, options);
  }
};

export default showToast;

```
Based on the provided TypeScript code, I will generate comprehensive documentation in Markdown format.

**Purpose and Usage**
--------------------

The `showToast` interface is designed to display toast notifications with customizable options. It takes a message as input and provides various ways to display the notification, such as success, error, info, or warning messages.

**Method Documentation: `showToast`**
-----------------------------------

### Method Signature

```javascript
const showToast = (message, type = "default", opts = {}) => {
  // ...
}
```

### Parameters

* `message`: The message to be displayed in the toast notification. Type: `string`.
* `type`: The type of notification to display (e.g., success, error, info, or warning). Type: `string`. Default: "default".
* `opts`: Additional options to customize the toast notification. Type: `object`.

### Return Value

None.

### Purpose and Description

The `showToast` method displays a toast notification with the provided message. The type of notification can be customized using the `type` parameter, and additional options can be passed through the `opts` object.

### Details about each parameter:

* `message`: The main content to be displayed in the toast notification.
* `type`: Determines the style and tone of the notification (e.g., success, error, info, or warning).
* `opts`: Provides additional customization options for the toast notification, such as position, auto-close time, hide progress bar, close on click, pause on hover, and theme.

### Examples

```javascript
// Display a success message with default options
showToast("Task completed successfully!");

// Display an error message with custom options (clear previous toasts)
showToast("Error occurred", "error", { clear: true });

// Display an info message with custom options (theme dark, auto-close time 5000ms)
showToast("New feature available!", "info", { theme: "dark", autoClose: 5000 });
```

**Dependencies**
----------------

The `showToast` method depends on the `toast` function from `react-toastify` and the `usePrefersDarkMode` hook.

### Relationships with other parts of the codebase

The `showToast` interface is designed to be used throughout the application, providing a consistent way to display toast notifications. It can be imported and used in various components and modules within the codebase.

**Clarity and Consistency**
-------------------------

The documentation provides clear and concise descriptions of each method, including its signature, parameters, return value, and purpose. The examples illustrate how to use the interface effectively. The documentation is well-organized, easy to understand, and consistent in style and terminology.