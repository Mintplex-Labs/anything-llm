```javascript
import { useState } from "react";
import FileRow from "../FileRow";
import { CaretDown, FolderNotch } from "@phosphor-icons/react";
import { middleTruncate } from "@/utils/directories";

export default function FolderRow({
  item,
  selected,
  onRowClick,
  toggleSelection,
  isSelected,
  autoExpanded = false,
}) {
  const [expanded, setExpanded] = useState(autoExpanded);

  const handleExpandClick = (event) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <>
      <tr
        onClick={onRowClick}
        className={`text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 bg-[#1C1E21] hover:bg-sky-500/20 cursor-pointer w-full file-row ${
          selected ? "selected" : ""
        }`}
      >
        <div className="col-span-6 flex gap-x-[4px] items-center">
          <div
            className="shrink-0 w-3 h-3 rounded border-[1px] border-white flex justify-center items-center cursor-pointer"
            role="checkbox"
            aria-checked={selected}
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              toggleSelection(item);
            }}
          >
            {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
          </div>
          <div
            onClick={handleExpandClick}
            className={`transform transition-transform duration-200 ${
              expanded ? "rotate-360" : " rotate-270"
            }`}
          >
            <CaretDown className="text-base font-bold w-4 h-4" />
          </div>
          <FolderNotch
            className="shrink-0 text-base font-bold w-4 h-4 mr-[3px]"
            weight="fill"
          />
          <p className="whitespace-nowrap overflow-show">
            {middleTruncate(item.name, 35)}
          </p>
        </div>
        <p className="col-span-2 pl-3.5" />
        <p className="col-span-2 pl-2" />
      </tr>
      {expanded && (
        <>
          {item.items.map((fileItem) => (
            <FileRow
              key={fileItem.id}
              item={fileItem}
              selected={isSelected(fileItem.id)}
              toggleSelection={toggleSelection}
            />
          ))}
        </>
      )}
    </>
  );
}

```
**FolderRow Documentation**

**Purpose and Usage:**
The `FolderRow` component is a React-based interface used to render folder items with expandable details. It provides an interactive experience for users to navigate through files and folders within a directory tree.

**Method Documentation:**

### Constructor
```typescript
export default function FolderRow({
  item,
  selected,
  onRowClick,
  toggleSelection,
  isSelected,
  autoExpanded = false,
}) {
  // ...
}
```
* `item`: The folder item object containing its name, ID, and possibly child items.
* `selected`: A boolean indicating whether the folder is currently selected.
* `onRowClick`: A callback function triggered when the user clicks on the folder row.
* `toggleSelection`: A callback function used to toggle the selection state of the folder.
* `isSelected`: A boolean representing the current selection state of the folder.
* `autoExpanded`: A boolean controlling whether the folder expands automatically (default: false).

### handleExpandClick
```typescript
const handleExpandClick = (event) => {
  event.stopPropagation();
  setExpanded(!expanded);
};
```
* This method handles the click event on the expand/collapse icon, toggling the `expanded` state of the folder.

### Return Value:
The component returns a JSX element representing the folder row with its details. When expanded, it includes child items rendered as separate `FileRow` components.

**Examples:**
```jsx
import React from 'react';
import { FolderRow } from './FolderRow';

const App = () => {
  const item = {
    name: 'My Folder',
    id: '1234567890',
    items: [
      {
        name: 'File A.txt',
        id: '11111111111',
      },
      {
        name: 'File B.txt',
        id: '22222222222',
      },
    ],
  };

  const selected = true;
  const onRowClick = () => console.log('Folder clicked!');
  const toggleSelection = () => console.log('Selection toggled!');
  const isSelected = selected;

  return (
    <div>
      <FolderRow
        item={item}
        selected={selected}
        onRowClick={onRowClick}
        toggleSelection={toggleSelection}
        isSelected={isSelected}
        autoExpanded={true}
      />
    </div>
  );
};
```
**Dependencies:**
The `FolderRow` component depends on the following:

* React library
* `FileRow` component (used for child items)

**Clarity and Consistency:**
This documentation aims to provide a clear understanding of the `FolderRow` component's purpose, usage, and behavior. The code examples demonstrate its usage in a real-world scenario, making it easier to integrate into your project.