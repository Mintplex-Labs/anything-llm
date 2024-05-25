```javascript
export default function PreLoader({ size = "16" }) {
  return (
    <div
      className={`h-${size} w-${size} animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}
    ></div>
  );
}

export function FullScreenLoader() {
  return (
    <div
      id="preloader"
      className="fixed left-0 top-0 z-999999 flex h-screen w-screen items-center justify-center bg-sidebar"
    >
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
}

```
# PreLoader and FullScreenLoader Documentation


## Purpose and Usage

The provided code defines two React components: `PreLoader` and `FullScreenLoader`. These components are designed to provide a visual indication of loading or processing activities within your application. The purpose of these components is to create a consistent and user-friendly experience when handling loading or processing tasks.

### PreLoader

The `PreLoader` component renders a spinning icon with a customizable size (defaulting to 16). It's intended for use as a lightweight, self-contained loader that can be easily integrated into your application. The component accepts an optional `size` parameter, which allows you to adjust the size of the spinner.

### FullScreenLoader

The `FullScreenLoader` component creates a full-screen overlay with a spinning icon (also customizable). It's designed for use cases where you need to occupy the entire screen while processing or loading data. The component accepts no parameters and returns a JSX element that can be easily inserted into your application.

## Method Documentation


### PreLoader

* **Signature:** `export default function PreLoader({ size = "16" })`
	+ Parameters:
		- `size`: A string representing the desired size of the spinner (default: `"16"`).
	+ Return type: JSX element
	+ Purpose: Returns a spinning icon with the specified size.
* **Return value:** The JSX element representing the spinning icon.

### FullScreenLoader

* **Signature:** `export function FullScreenLoader()`
	+ Parameters: None
	+ Return type: JSX element
	+ Purpose: Creates a full-screen overlay with a spinning icon.
* **Return value:** The JSX element representing the full-screen overlay and spinner.

## Examples


### Using PreLoader

```javascript
import React from 'react';
import { PreLoader } from './PreLoader';

const MyComponent = () => {
  return (
    <div>
      {/* Your application content here */}
      { /* Load data or process something */ }
      <PreLoader size="24" />
    </div>
  );
};
```

### Using FullScreenLoader

```javascript
import React from 'react';
import { FullScreenLoader } from './FullScreenLoader';

const MyComponent = () => {
  return (
    <div>
      {/* Your application content here */}
      { /* Load data or process something */ }
      <FullScreenLoader />
    </div>
  );
};
```

## Dependencies

None.

## Clarity and Consistency

The provided code is well-organized, easy to understand, and consistent in style and terminology. The documentation aims to maintain this consistency by using clear language and concise examples.