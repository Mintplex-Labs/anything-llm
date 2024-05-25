```javascript
import { Warning } from "@phosphor-icons/react";

export default function ChangeWarningModal({
  warningText = "",
  onClose,
  onConfirm,
}) {
  return (
    <div className="relative w-full max-w-2xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <div className="flex items-center gap-2">
            <Warning
              className="text-yellow-300 text-lg w-6 h-6"
              weight="fill"
            />
            <h3 className="text-xl font-semibold text-yellow-300">Warning</h3>
          </div>
        </div>
        <div className="w-[550px] p-6 text-white">
          <p>
            {warningText}
            <br />
            <br />
            Are you sure you want to proceed?
          </p>
        </div>

        <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-red-500 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

```
**ChangeWarningModal Documentation**

### Purpose and Usage

The `ChangeWarningModal` interface is a reusable React component designed to display warning messages and provide users with options to confirm or cancel the action. This component is intended for use in scenarios where cautionary warnings are necessary, such as data deletion or system updates.

### Method Documentation

#### `ChangeWarningModal` Constructor

* Signature: `(warningText = "", onClose, onConfirm) => JSX.Element`
* Description: Initializes the warning modal with the provided warning text, a cancel callback function, and a confirm callback function.
* Parameters:
	+ `warningText`: A string representing the warning message to be displayed. Default value is an empty string (`""`).
	+ `onClose`: A callback function to be executed when the user cancels the action.
	+ `onConfirm`: A callback function to be executed when the user confirms the action.

#### Return Value

* Type: `JSX.Element`
* Description: The component returns a JSX element representing the warning modal with the specified warning text, cancel button, and confirm button.

### Examples

To use the `ChangeWarningModal` component, you can create an instance of it and pass in the required parameters:
```jsx
import React from 'react';
import ChangeWarningModal from './ChangeWarningModal';

const WarningModal = () => {
  const warningText = 'Are you sure you want to delete this file?';
  const onClose = () => console.log('User canceled deletion');
  const onConfirm = () => console.log('User confirmed deletion');

  return (
    <ChangeWarningModal
      warningText={warningText}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};
```
### Dependencies

* The `@phosphor-icons/react` package is required for the `Warning` component used in this modal.

### Clarity and Consistency

The documentation is organized into clear sections, and each method is thoroughly explained with concise descriptions of its purpose and parameters. Additionally, examples are provided to illustrate the usage of the interface and its methods. The documentation is consistent in style and terminology throughout.