```javascript
import useUser from "@/hooks/useUser";
import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";

export default function SupportEmail() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    const fetchSupportEmail = async () => {
      const supportEmail = await System.fetchSupportEmail();
      setSupportEmail(supportEmail.email || "");
      setOriginalEmail(supportEmail.email || "");
      setLoading(false);
    };
    fetchSupportEmail();
  }, []);

  const updateSupportEmail = async (e, newValue = null) => {
    e.preventDefault();
    let support_email = newValue;
    if (newValue === null) {
      const form = new FormData(e.target);
      support_email = form.get("supportEmail");
    }

    const { success, error } = await Admin.updateSystemPreferences({
      support_email,
    });

    if (!success) {
      showToast(`Failed to update support email: ${error}`, "error");
      return;
    } else {
      showToast("Successfully updated support email.", "success");
      window.localStorage.removeItem(System.cacheKeys.supportEmail);
      setSupportEmail(support_email);
      setOriginalEmail(support_email);
      setHasChanges(false);
    }
  };

  const handleChange = (e) => {
    setSupportEmail(e.target.value);
    setHasChanges(true);
  };

  if (loading || !user?.role) return null;
  return (
    <form className="mb-6" onSubmit={updateSupportEmail}>
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base leading-6 font-bold text-white">
          Support Email
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60">
          Set the support email address that shows up in the user menu while
          logged into this instance.
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <input
          name="supportEmail"
          type="email"
          className="bg-zinc-900 mt-3 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-[275px] placeholder:text-white/20"
          placeholder="support@mycompany.com"
          required={true}
          autoComplete="off"
          onChange={handleChange}
          value={supportEmail}
        />
        {originalEmail !== "" && (
          <button
            type="button"
            onClick={(e) => updateSupportEmail(e, "")}
            className="mt-4 text-white text-base font-medium hover:text-opacity-60"
          >
            Clear
          </button>
        )}
      </div>
      {hasChanges && (
        <button
          type="submit"
          className="transition-all mt-6 w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          Save
        </button>
      )}
    </form>
  );
}

```
**SupportEmail Interface Documentation**

### Purpose and Usage

The `SupportEmail` interface provides a React component for managing support email addresses. This component is used to set and update the support email address that appears in the user menu while logged into an instance.

### Method Documentation

#### `fetchSupportEmail`

* **Signature:** `async () => {}`
* **Purpose:** Fetches the current support email address from the System model.
* **Return value:** The fetched support email address or an empty string if no email is set.
* **Dependencies:** None
* **Example:**
```typescript
const supportEmail = await fetchSupportEmail();
console.log(supportEmail); // Output: "support@mycompany.com"
```

#### `updateSupportEmail`

* **Signature:** `async (e, newValue = null) => {}`
* **Purpose:** Updates the support email address in the System model.
* **Parameters:**
	+ `e`: The event object from the React component.
	+ `newValue`: The new support email address to set. If not provided, the current form data is used.
* **Return value:** An object containing a success flag and an error message if the update fails.
* **Dependencies:** Admin model and System model
* **Example:**
```typescript
const { success, error } = await updateSupportEmail(e, "new-support-email@example.com");
if (!success) {
  console.error(error); // Output: "Failed to update support email: Email already in use"
} else {
  console.log("Successfully updated support email.");
}
```

#### `handleChange`

* **Signature:** `(e) => {}`
* **Purpose:** Handles changes to the support email input field.
* **Parameter:** The event object from the React component.
* **Return value:** None
* **Dependencies:** None
* **Example:**
```typescript
const handleInput = (e) => {
  setSupportEmail(e.target.value);
  setHasChanges(true);
};
```

### Examples

Here's an example of how to use the `SupportEmail` component:
```jsx
import React from "react";
import SupportEmail from "./SupportEmail";

function MyComponent() {
  return (
    <div>
      <h2>Support Email</h2>
      <p>Set the support email address that shows up in the user menu.</p>
      <SupportEmail />
    </div>
  );
}
```
### Dependencies

The `SupportEmail` interface depends on the following parts of the codebase:

* `@/hooks/useUser`: Provides the current user object.
* `@/models/admin`: Manages system preferences, including support email updates.
* `@/models/system`: Fetches and sets the current support email address.

### Clarity and Consistency

The documentation is organized into sections for easy reference. Each method is documented with its signature, purpose, return value, dependencies, and an example usage. This provides a clear understanding of how to use the interface and its methods.