```javascript
import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useQuery from "@/hooks/useQuery";
import ChatRow from "./ChatRow";
import Embed from "@/models/embed";

export default function EmbedChats() {
  // TODO [FEAT]: Add export of embed chats
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="flex gap-x-4 items-center">
              <p className="text-lg leading-6 font-bold text-white">
                Embed Chats
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              These are all the recorded chats and messages from any embed that
              you have published.
            </p>
          </div>
          <ChatsContainer />
        </div>
      </div>
    </div>
  );
}

function ChatsContainer() {
  const query = useQuery();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [offset, setOffset] = useState(Number(query.get("offset") || 0));
  const [canNext, setCanNext] = useState(false);

  const handlePrevious = () => {
    setOffset(Math.max(offset - 1, 0));
  };
  const handleNext = () => {
    setOffset(offset + 1);
  };

  const handleDeleteChat = (chatId) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
  };

  useEffect(() => {
    async function fetchChats() {
      const { chats: _chats, hasPages = false } = await Embed.chats(offset);
      setChats(_chats);
      setCanNext(hasPages);
      setLoading(false);
    }
    fetchChats();
  }, [offset]);

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
    <>
      <table className="w-full text-sm text-left rounded-lg mt-5">
        <thead className="text-white text-opacity-80 text-sm font-bold uppercase border-white border-b border-opacity-60">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-tl-lg">
              Embed
            </th>
            <th scope="col" className="px-6 py-3">
              Sender
            </th>
            <th scope="col" className="px-6 py-3">
              Message
            </th>
            <th scope="col" className="px-6 py-3">
              Response
            </th>
            <th scope="col" className="px-6 py-3">
              Sent At
            </th>
            <th scope="col" className="px-6 py-3 rounded-tr-lg">
              {" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {!!chats &&
            chats.map((chat) => (
              <ChatRow key={chat.id} chat={chat} onDelete={handleDeleteChat} />
            ))}
        </tbody>
      </table>
      <div className="flex w-full justify-between items-center">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:invisible"
          disabled={offset === 0}
        >
          {" "}
          Previous Page
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:invisible"
          disabled={!canNext}
        >
          Next Page
        </button>
      </div>
    </>
  );
}

```
I'd be happy to help you generate comprehensive documentation for the provided TypeScript code. Here's my attempt:

**Purpose and Usage**
The `ChatsContainer` interface is responsible for managing and displaying a list of recorded chats and messages from embedded components (embeds). It provides a way to paginate through these conversations, allowing users to navigate between previous and next pages.

**Method Documentation**

### ChatsContainer()
#### Purpose
Initializes the chat container by fetching the initial set of chats and setting up pagination controls.

#### Parameters

* `query`: The query object containing information about the current state (e.g., offset).

#### Return Value
The initialized `ChatsContainer` component with its internal state updated accordingly.

### handlePrevious()
#### Purpose
Moves the pagination offset to the previous page, loading more chats if available.

#### Parameters
None

#### Return Value
Updates the internal state of the `ChatsContainer` to reflect the new offset.

### handleNext()
#### Purpose
Moves the pagination offset to the next page, loading more chats if available.

#### Parameters
None

#### Return Value
Updates the internal state of the `ChatsContainer` to reflect the new offset.

### handleDeleteChat(chatId)
#### Purpose
Removes a specific chat from the list by filtering out the chat with the given ID.

#### Parameters

* `chatId`: The unique identifier of the chat to be removed.

#### Return Value
Updates the internal state of the `ChatsContainer` by removing the specified chat.

**Examples**

To demonstrate the usage of `ChatsContainer`, let's consider a scenario where we have an embed component that publishes multiple chats. We can use the following code:
```typescript
import { ChatsContainer } from './chats-container';

const App = () => {
  const query = useQuery();
  const [chats, setChats] = useState([]);
  const offset = Number(query.get("offset") || 0);
  const canNext = false;

  return (
    <div>
      <ChatsContainer
        query={query}
        chats={chats}
        offset={offset}
        canNext={canNext}
        handlePrevious={() => console.log('Previous page clicked')}
        handleNext={() => console.log('Next page clicked')}
        handleDeleteChat={(chatId) => console.log(`Chat ${chatId} deleted`)}
      />
    </div>
  );
};
```
In this example, we create an instance of `ChatsContainer` and pass it the necessary props (query, chats, offset, canNext). We also define three event handlers (`handlePrevious`, `handleNext`, and `handleDeleteChat`) that will be triggered when the user interacts with the component.

**Dependencies**
The `ChatsContainer` interface depends on the following:

* The `useQuery()` hook for accessing query parameters.
* The `useState()` hook for managing internal state.
* The `Embed` module (not shown) for fetching and processing chats.

**Clarity and Consistency**
Throughout this documentation, I've aimed to maintain a consistent tone and style, making it easy to understand the purpose and usage of each method within the `ChatsContainer` interface.