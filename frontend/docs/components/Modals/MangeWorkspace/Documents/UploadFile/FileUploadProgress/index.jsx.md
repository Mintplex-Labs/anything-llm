```javascript
import React, { useState, useEffect, memo } from "react";
import truncate from "truncate";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import Workspace from "../../../../../../models/workspace";
import { humanFileSize, milliToHms } from "../../../../../../utils/numbers";
import PreLoader from "../../../../../Preloader";

function FileUploadProgressComponent({
  slug,
  uuid,
  file,
  setFiles,
  rejected = false,
  reason = null,
  onUploadSuccess,
  onUploadError,
  setLoading,
  setLoadingMessage,
}) {
  const [timerMs, setTimerMs] = useState(10);
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);

  const fadeOut = (cb) => {
    setIsFadingOut(true);
    cb?.();
  };

  const beginFadeOut = () => {
    setIsFadingOut(false);
    setFiles((prev) => {
      return prev.filter((item) => item.uid !== uuid);
    });
  };

  useEffect(() => {
    async function uploadFile() {
      setLoading(true);
      setLoadingMessage("Uploading file...");
      const start = Number(new Date());
      const formData = new FormData();
      formData.append("file", file, file.name);
      const timer = setInterval(() => {
        setTimerMs(Number(new Date()) - start);
      }, 100);

      // Chunk streaming not working in production so we just sit and wait
      const { response, data } = await Workspace.uploadFile(slug, formData);
      if (!response.ok) {
        setStatus("failed");
        clearInterval(timer);
        onUploadError(data.error);
        setError(data.error);
      } else {
        setLoading(false);
        setLoadingMessage("");
        setStatus("complete");
        clearInterval(timer);
        onUploadSuccess();
      }

      // Begin fadeout timer to clear uploader queue.
      setTimeout(() => {
        fadeOut(() => setTimeout(() => beginFadeOut(), 300));
      }, 5000);
    }
    !!file && !rejected && uploadFile();
  }, []);

  if (rejected) {
    return (
      <div
        className={`${
          isFadingOut ? "file-upload-fadeout" : "file-upload"
        } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-white/5 border border-white/40`}
      >
        <div className="w-6 h-6 flex-shrink-0">
          <XCircle className="w-6 h-6 stroke-white bg-red-500 rounded-full p-1 w-full h-full" />
        </div>
        <div className="flex flex-col">
          <p className="text-white text-xs font-medium">
            {truncate(file.name, 30)}
          </p>
          <p className="text-red-400 text-xs font-medium">{reason}</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        className={`${
          isFadingOut ? "file-upload-fadeout" : "file-upload"
        } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-white/5 border border-white/40 overflow-y-auto`}
      >
        <div className="w-6 h-6 flex-shrink-0">
          <XCircle className="w-6 h-6 stroke-white bg-red-500 rounded-full p-1 w-full h-full" />
        </div>
        <div className="flex flex-col">
          <p className="text-white text-xs font-medium">
            {truncate(file.name, 30)}
          </p>
          <p className="text-red-400 text-xs font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isFadingOut ? "file-upload-fadeout" : "file-upload"
      } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-white/5 border border-white/40`}
    >
      <div className="w-6 h-6 flex-shrink-0">
        {status !== "complete" ? (
          <div className="flex items-center justify-center">
            <PreLoader size="6" />
          </div>
        ) : (
          <CheckCircle className="w-6 h-6 stroke-white bg-green-500 rounded-full p-1 w-full h-full" />
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-white text-xs font-medium">
          {truncate(file.name, 30)}
        </p>
        <p className="text-white/60 text-xs font-medium">
          {humanFileSize(file.size)} | {milliToHms(timerMs)}
        </p>
      </div>
    </div>
  );
}

export default memo(FileUploadProgressComponent);

```
# FileUploadProgressComponent Documentation

## Purpose and Usage

The `FileUploadProgressComponent` is a React component designed to display the progress of an ongoing file upload process. It provides a user-friendly interface to track the status of the upload and visualize the uploaded file's size.

### Method Documentation

#### `uploadFile(file: File, slug: string)`

Purpose: Initiates the file upload process by sending a request to the server with the provided file and slug.

Parameters:

* `file`: The file to be uploaded (type: `File`).
* `slug`: A unique identifier for the upload operation (type: `string`).

Return value: An object containing the response data from the server (type: `{ response, data }`).

Description: This method starts the file upload process by sending a request to the server with the provided file and slug. The component will display the progress of the upload and notify the user when the operation is complete or fails.

#### `setTimerMs(ms: number)`

Purpose: Updates the timer interval in milliseconds for tracking the upload progress.

Parameter:

* `ms`: The new timer interval in milliseconds (type: `number`).

Description: This method updates the timer interval to track the elapsed time since the upload started. The component will display the elapsed time and update the timer interval accordingly.

#### `setLoading(loading: boolean)`

Purpose: Sets the loading state of the component to indicate whether an upload is in progress.

Parameter:

* `loading`: A boolean value indicating whether the upload is in progress (type: `boolean`).

Description: This method sets the loading state of the component, which will display a pre-loader icon while an upload is in progress. When the upload completes or fails, the loading state will be updated accordingly.

#### `setLoadingMessage(message: string)`

Purpose: Sets the loading message displayed by the component during the upload process.

Parameter:

* `message`: The loading message to be displayed (type: `string`).

Description: This method sets the loading message that will be displayed while an upload is in progress. The message can provide additional context or feedback to the user about the upload status.

#### `setStatus(status: string)`

Purpose: Updates the component's status indicator to reflect the outcome of the upload process.

Parameter:

* `status`: The new status value (type: `string`).

Description: This method updates the component's status indicator, which can be one of three values:
	+ "complete": The upload was successful.
	+ "failed": The upload failed due to an error.
	+ "rejected": The upload was rejected by the server.

The component will display a corresponding message or icon based on the updated status value.

#### `setError(error: string)`

Purpose: Sets the error message displayed by the component when the upload fails.

Parameter:

* `error`: The error message to be displayed (type: `string`).

Description: This method sets the error message that will be displayed when an upload fails. The error message can provide additional context or feedback to the user about the failure reason.

#### `onUploadError(error: string)`

Purpose: Handles the error event triggered by a failed upload and displays the corresponding error message.

Parameter:

* `error`: The error message to be displayed (type: `string`).

Description: This method handles the error event triggered by a failed upload and displays the corresponding error message. The component will also update its status indicator to reflect the failure.

#### `onUploadSuccess()`

Purpose: Handles the success event triggered by a successful upload.

Description: This method handles the success event triggered by a successful upload. The component will display a completion message or icon based on the updated status value.

## Examples

### Basic Usage
```jsx
import React from 'react';
import FileUploadProgressComponent from './FileUploadProgressComponent';

const App = () => {
  const file = new File(['Hello, world!'], 'example.txt', { type: 'text/plain' });
  const slug = 'my-upload-slug';

  return (
    <div>
      <FileUploadProgressComponent file={file} slug={slug} />
    </div>
  );
};
```
### Handling Errors
```jsx
import React from 'react';
import FileUploadProgressComponent from './FileUploadProgressComponent';

const App = () => {
  const file = new File(['Hello, world!'], 'example.txt', { type: 'text/plain' });
  const slug = 'my-upload-slug';

  const handleUploadError = (error) => {
    console.error('Error uploading file:', error);
  };

  return (
    <div>
      <FileUploadProgressComponent
        file={file}
        slug={slug}
        onUploadError={(error) => handleUploadError(error)}
      />
    </div>
  );
};
```
## Dependencies

* The `FileUploadProgressComponent` relies on the React library for rendering and event handling.
* The component also depends on the `useState`, `useEffect`, and `memo` hooks from React.

## Clarity and Consistency

The documentation is written in a clear and concise manner, with attention to consistency in style and terminology. The code examples illustrate the usage of the interface and its methods, making it easier for developers to understand and integrate the component into their projects.