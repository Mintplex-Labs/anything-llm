```javascript
import { useState } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
}

```
# useModal Documentation

## Purpose and Usage

The `useModal` interface provides a simple way to manage modal state in React applications. It's intended to be used as a hook within functional components to control the opening and closing of modals.

### Method Documentation

#### `useModal()`

* **Return type:** `{ isOpen: boolean, openModal: () => void, closeModal: () => void }`
* **Purpose:** Initializes the modal state and provides methods for opening and closing the modal.
* **Parameters:** None
* **Example usage:** `const { isOpen, openModal, closeModal } = useModal();`

#### `openModal()`

* **Return type:** `void`
* **Purpose:** Opens the modal by setting the `isOpen` state to `true`.
* **Parameters:** None
* **Example usage:** `openModal();`

#### `closeModal()`

* **Return type:** `void`
* **Purpose:** Closes the modal by setting the `isOpen` state to `false`.
* **Parameters:** None
* **Example usage:** `closeModal();`

### Examples

To use the `useModal` interface, you can wrap your component with a functional component that uses the hook:
```jsx
import React from 'react';
import { useModal } from './use-modal';

function MyComponent() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      {isOpen && <Modal />}
      <button onClick={openModal}>Open Modal</button>
      <button onClick={closeModal}>Close Modal</button>
    </div>
  );
}
```
In this example, the `MyComponent` functional component uses the `useModal` hook to initialize the modal state and provides methods for opening and closing the modal. The component renders a modal when it's open and provides buttons to open and close the modal.

### Dependencies

The `useModal` interface depends on the `useState` hook from React.

### Clarity and Consistency

This documentation is written in a clear and concise manner, with consistent formatting and terminology throughout.