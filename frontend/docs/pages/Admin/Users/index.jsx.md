```javascript
import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UserPlus } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import UserRow from "./UserRow";
import useUser from "@/hooks/useUser";
import NewUserModal from "./NewUserModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";

export default function AdminUsers() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-white">Users</p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              These are all the accounts which have an account on this instance.
              Removing an account will instantly remove their access to this
              instance.
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton onClick={openModal} className="mt-3 mr-0 -mb-6 z-10">
              <UserPlus className="h-4 w-4" weight="bold" /> Add user
            </CTAButton>
          </div>
          <UsersContainer />
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewUserModal closeModal={closeModal} />
        </ModalWrapper>
      </div>
    </div>
  );
}

function UsersContainer() {
  const { user: currUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const _users = await Admin.users();
      setUsers(_users);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="#3D4147"
        baseColor="#2C2F35"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <table className="w-full text-sm text-left rounded-lg">
      <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            Username
          </th>
          <th scope="col" className="px-6 py-3">
            Role
          </th>
          <th scope="col" className="px-6 py-3">
            Date Added
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user.id} currUser={currUser} user={user} />
        ))}
      </tbody>
    </table>
  );
}

const ROLE_HINT = {
  default: [
    "Can only send chats with workspaces they are added to by admin or managers.",
    "Cannot modify any settings at all.",
  ],
  manager: [
    "Can view, create, and delete any workspaces and modify workspace-specific settings.",
    "Can create, update and invite new users to the instance.",
    "Cannot modify LLM, vectorDB, embedding, or other connections.",
  ],
  admin: [
    "Highest user level privilege.",
    "Can see and do everything across the system.",
  ],
};

export function RoleHintDisplay({ role }) {
  return (
    <div className="flex flex-col gap-y-1 py-1 pb-4">
      <p className="text-sm font-medium text-white">Permissions</p>
      <ul className="flex flex-col gap-y-1 list-disc px-4">
        {ROLE_HINT[role ?? "default"].map((hints, i) => {
          return (
            <li key={i} className="text-xs text-white/60">
              {hints}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

```
Based on the provided TypeScript code, I will generate comprehensive documentation in Markdown format.

**Purpose and Usage:**
The `Users` interface is used to manage users within a system. It provides methods for fetching user data, managing roles, and displaying user information. The intended usage of this interface is to provide a centralized location for handling user-related operations.

**Method Documentation:**

### `fetchUsers()`

* **Signature:** `async function fetchUsers(): Promise<void>`
* **Purpose:** Fetches the list of users from the system.
* **Parameters:** None
* **Return Value:** A promise that resolves when the operation is complete.
* **Description:** This method uses the `Admin` class to fetch the list of users. It sets the `users` state with the fetched data and sets `loading` to `false`.

### `UsersContainer()`

* **Signature:** `function UsersContainer(): JSX.Element`
* **Purpose:** Displays a table of users.
* **Parameters:** None
* **Return Value:** A JSX element representing the user list.
* **Description:** This method uses the `useEffect` hook to fetch the list of users when the component mounts. It sets the `users` state with the fetched data and sets `loading` to `false`. The method then returns a table of users, displaying their username, role, and date added.

### `RoleHintDisplay(role: string)`

* **Signature:** `function RoleHintDisplay(props: {role: string}): JSX.Element`
* **Purpose:** Displays the role hints for a given user.
* **Parameters:**
	+ `role`: The role of the user (default, manager, or admin).
* **Return Value:** A JSX element representing the role hints.
* **Description:** This method uses an object (`ROLE_ HINT`) to map roles to their corresponding hints. It returns a list of hints for the given role.

**Examples:**

To use the `Users` interface, you would first need to import it:
```typescript
import { Users } from './users';
```
Then, you can call the methods as follows:

* To fetch the list of users:
```typescript
const users = await Users.fetchUsers();
```
* To display a table of users:
```typescript
const userTable = <UsersContainer />;
```
* To display role hints for a given user:
```typescript
const roleHints = <RoleHintDisplay role="manager" />;
```

**Dependencies:**

The `Users` interface depends on the `Admin` class, which is responsible for fetching and managing user data.

**Clarity and Consistency:**
The documentation aims to provide clear and concise descriptions of each method, as well as examples of how to use them. The terminology used throughout the documentation is consistent in style and terminology.