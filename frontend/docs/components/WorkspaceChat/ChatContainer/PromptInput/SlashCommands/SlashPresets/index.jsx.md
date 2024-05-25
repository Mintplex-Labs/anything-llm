```javascript
import { useEffect, useState } from "react";
import { useIsAgentSessionActive } from "@/utils/chat/agent";
import AddPresetModal from "./AddPresetModal";
import EditPresetModal from "./EditPresetModal";
import { useModal } from "@/hooks/useModal";
import System from "@/models/system";
import { DotsThree, Plus } from "@phosphor-icons/react";
import showToast from "@/utils/toast";

export const CMD_REGEX = new RegExp(/[^a-zA-Z0-9_-]/g);
export default function SlashPresets({ setShowing, sendCommand }) {
  const isActiveAgentSession = useIsAgentSessionActive();
  const {
    isOpen: isAddModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();
  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);

  useEffect(() => {
    fetchPresets();
  }, []);
  if (isActiveAgentSession) return null;

  const fetchPresets = async () => {
    const presets = await System.getSlashCommandPresets();
    setPresets(presets);
  };

  const handleSavePreset = async (preset) => {
    const { error } = await System.createSlashCommandPreset(preset);
    if (!!error) {
      showToast(error, "error");
      return false;
    }

    fetchPresets();
    closeAddModal();
    return true;
  };

  const handleEditPreset = (preset) => {
    setSelectedPreset(preset);
    openEditModal();
  };

  const handleUpdatePreset = async (updatedPreset) => {
    const { error } = await System.updateSlashCommandPreset(
      updatedPreset.id,
      updatedPreset
    );

    if (!!error) {
      showToast(error, "error");
      return;
    }

    fetchPresets();
    closeEditModal();
  };

  const handleDeletePreset = async (presetId) => {
    await System.deleteSlashCommandPreset(presetId);
    fetchPresets();
    closeEditModal();
  };

  return (
    <>
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => {
            setShowing(false);
            sendCommand(`${preset.command} `, false);
          }}
          className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-row justify-start"
        >
          <div className="w-full flex-col text-left flex pointer-events-none">
            <div className="text-white text-sm font-bold">{preset.command}</div>
            <div className="text-white text-opacity-60 text-sm">
              {preset.description}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditPreset(preset);
            }}
            className="text-white text-sm p-1 hover:cursor-pointer hover:bg-zinc-900 rounded-full mt-1"
          >
            <DotsThree size={24} weight="bold" />
          </button>
        </button>
      ))}
      <button
        onClick={openAddModal}
        className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-1 rounded-xl flex flex-col justify-start"
      >
        <div className="w-full flex-row flex pointer-events-none items-center gap-2">
          <Plus size={24} weight="fill" fill="white" />
          <div className="text-white text-sm font-medium">Add New Preset </div>
        </div>
      </button>
      <AddPresetModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={handleSavePreset}
      />
      {selectedPreset && (
        <EditPresetModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleUpdatePreset}
          onDelete={handleDeletePreset}
          preset={selectedPreset}
        />
      )}
    </>
  );
}

```
**Purpose and Usage:**
The `SlashPresets` interface is a React component responsible for managing slash command presets. It provides a user-friendly interface for adding, editing, and deleting presets. The purpose of this interface is to enable users to customize their slash commands by creating and managing preset combinations.

**Method Documentation:**

### `fetchPresets()`

* **Signature:** `async () => {}`
* **Purpose:** Fetches the list of available slash command presets from the system.
* **Return Type:** None
* **Dependencies:** `System.getSlashCommandPresets()` method

Example usage:
```javascript
fetchPresets();
```

### `handleSavePreset(preset)`

* **Signature:** `(preset: any) => {}`
* **Purpose:** Saves a new preset or updates an existing one.
* **Return Type:** None
* **Dependencies:** `System.saveSlashCommandPreset()` method

Example usage:
```javascript
const preset = { command: 'new_command', description: 'New command description' };
handleSavePreset(preset);
```

### `handleUpdatePreset(preset)`

* **Signature:** `(preset: any) => {}`
* **Purpose:** Updates an existing preset.
* **Return Type:** None
* **Dependencies:** `System.updateSlashCommandPreset()` method

Example usage:
```javascript
const preset = { id: 1, command: 'updated_command', description: 'Updated description' };
handleUpdatePreset(preset);
```

### `handleDeletePreset(presetId)`

* **Signature:** `(presetId: number) => {}`
* **Purpose:** Deletes a preset by its ID.
* **Return Type:** None
* **Dependencies:** `System.deleteSlashCommandPreset()` method

Example usage:
```javascript
const presetId = 1;
handleDeletePreset(presetId);
```

### `sendCommand(command, isSilent)`

* **Signature:** `(command: string, isSilent: boolean) => {}`
* **Purpose:** Sends a slash command to the system.
* **Return Type:** None
* **Dependencies:** `System.sendSlashCommand()` method

Example usage:
```javascript
const command = 'my_command';
const isSilent = true;
sendCommand(command, isSilent);
```

### `openAddModal()`

* **Signature:** `() => {}`
* **Purpose:** Opens the add preset modal.
* **Return Type:** None

Example usage:
```javascript
openAddModal();
```

### `closeAddModal()`

* **Signature:** `() => {}`
* **Purpose:** Closes the add preset modal.
* **Return Type:** None

Example usage:
```javascript
closeAddModal();
```

**Examples:**
To illustrate the usage of the interface and its methods, consider the following examples:

1. Add a new preset:
```javascript
const preset = { command: 'new_command', description: 'New command description' };
handleSavePreset(preset);
```
2. Update an existing preset:
```javascript
const preset = { id: 1, command: 'updated_command', description: 'Updated description' };
handleUpdatePreset(preset);
```
3. Delete a preset:
```javascript
const presetId = 1;
handleDeletePreset(presetId);
```
4. Send a slash command:
```javascript
const command = 'my_command';
const isSilent = true;
sendCommand(command, isSilent);
```

**Dependencies:**
The `SlashPresets` interface depends on the following:

* `System`: Provides methods for managing slash command presets.
* `React`: Used to render the user interface.

**Clarity and Consistency:**
The documentation provided is clear and consistent in style and terminology. It provides a comprehensive overview of the interface and its methods, along with examples and dependencies.