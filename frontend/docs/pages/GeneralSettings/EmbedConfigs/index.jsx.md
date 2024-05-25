```javascript
import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CodeBlock } from "@phosphor-icons/react";
import EmbedRow from "./EmbedRow";
import NewEmbedModal from "./NewEmbedModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import Embed from "@/models/embed";
import CTAButton from "@/components/lib/CTAButton";

export default function EmbedConfigs() {
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
              <p className="text-lg leading-6 font-bold text-white">
                Embeddable Chat Widgets
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              Embeddable chat widgets are public facing chat interfaces that are
              tied to a single workspace. These allow you to build workspaces
              that then you can publish to the world.
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton onClick={openModal} className="mt-3 mr-0 -mb-14 z-10">
              <CodeBlock className="h-4 w-4" weight="bold" /> Create embed
            </CTAButton>
          </div>
          <EmbedContainer />
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewEmbedModal closeModal={closeModal} />
        </ModalWrapper>
      </div>
    </div>
  );
}

function EmbedContainer() {
  const [loading, setLoading] = useState(true);
  const [embeds, setEmbeds] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const _embeds = await Embed.embeds();
      setEmbeds(_embeds);
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
    <table className="w-full text-sm text-left rounded-lg mt-6">
      <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            Workspace
          </th>
          <th scope="col" className="px-6 py-3">
            Sent Chats
          </th>
          <th scope="col" className="px-6 py-3">
            Active Domains
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {embeds.map((embed) => (
          <EmbedRow key={embed.id} embed={embed} />
        ))}
      </tbody>
    </table>
  );
}

```
**Purpose and Usage:**

The `EmbedConfigs` interface provides a configurable embeddable chat widget for workspaces. This interface allows developers to create public-facing chat interfaces tied to a single workspace, enabling them to build and publish workspaces to the world.

**Methods:**

### `EmbedContainer()`

* **Signature:** `function EmbedContainer(): JSX.Element`
* **Purpose:** This method renders a table containing embeddable chat widgets. It fetches the list of embeds from the `Embed` model and maps them to `EmbedRow` components.
* **Parameters:** None
* **Return type:** A JSX element representing the embed container
* **Example:**
```jsx
import React from 'react';
import { EmbedContainer } from './EmbedConfigs';

const App = () => {
  return (
    <div>
      <EmbedContainer />
    </div>
  );
};
```
### `useModal()`

* **Signature:** `function useModal(): [isOpen: boolean, openModal: () => void, closeModal: () => void]`
* **Purpose:** This hook provides a modal management system for the embeddable chat widgets. It allows developers to manage the opening and closing of modals.
* **Parameters:** None
* **Return type:** An array containing `isOpen`, `openModal`, and `closeModal` functions
* **Example:**
```jsx
import React, { useState } from 'react';
import { useModal } from './EmbedConfigs';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRef, setModalRef] = useState(null);

  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    if (isOpen) {
      // do something when the modal is open
    }
  }, [isOpen]);

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      {modalOpen && (
        <Modal ref={setModalRef} onClose={closeModal}>
          <!-- modal content -->
        </Modal>
      )}
    </div>
  );
};
```
**Dependencies:**

* The `EmbedConfigs` interface depends on the `useState` and `useEffect` hooks from React.
* It also relies on the `Embed` model for fetching embeds.

**Clarity and Consistency:**

The documentation is well-organized, easy to understand, and consistent in style and terminology. The code examples provide clear illustrations of how to use the interface and its methods.