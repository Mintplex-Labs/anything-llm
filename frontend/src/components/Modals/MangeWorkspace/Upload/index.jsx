import React, { useState, useCallback } from "react";
import Workspace from "../../../../models/workspace";
import paths from "../../../../utils/paths";
import FileUploadProgress from "./FileUploadProgress";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";

export default function UploadToWorkspace({ workspace }) {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => {
      return {
        uid: v4(),
        file,
      };
    });
    setFiles([...files, ...newFiles]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const deleteWorkspace = async () => {
    if (
      !window.confirm(
        `You are about to delete your entire ${workspace.name} workspace. This will remove all vector embeddings on your vector database.\n\nThe original source files will remain untouched. This action is irreversible.`
      )
    )
      return false;
    await Workspace.delete(workspace.slug);
    workspace.slug === slug
      ? (window.location = paths.home())
      : window.location.reload();
  };

  return (
    <>
      <div className="p-6 flex h-full w-full max-h-[80vh] overflow-y-scroll">
        <div className="flex flex-col gap-y-1 w-full">
          <div className="flex flex-col mb-2">
            <p className="text-gray-800 dark:text-stone-200 text-base ">
              Add documents to your workspace.
            </p>
            <p className="text-gray-600 dark:text-stone-400 text-xs ">
              These files will be uploaded to the document processor running
              locally on your machine. These files are not sent or shared with a
              third party.
            </p>
            {process.env.NODE_ENV !== "production" && (
              <div className="mt-2 text-gray-600 dark:text-stone-400 text-xs">
                <div className="w-[1px] bg-stone-400 w-full" />
                Local Environment Notice: You must have the{" "}
                <code className=" text-xs bg-gray-200 text-gray-800 dark:bg-stone-800 dark:text-slate-400 font-mono rounded-lg p-1">
                  collector/watch.py
                </code>{" "}
                script running for these documents to automatically process.
              </div>
            )}
          </div>

          <div
            {...getRootProps()}
            className="outline-none transition-all cursor-pointer duration-300 hover:bg-opacity-40 bg-stone-400 bg-opacity-20 flex h-[20rem] overflow-y-scroll overflow-x-hidden rounded-lg"
          >
            <input {...getInputProps()} />

            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 mb-3 text-gray-600 dark:text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-600 dark:text-slate-300">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-600 dark:text-slate-300"></p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full p-4 gap-y-2">
                {files.map((file) => (
                  <FileUploadProgress
                    key={file.uid}
                    file={file.file}
                    slug={workspace.slug}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
        <button
          onClick={deleteWorkspace}
          type="button"
          className="border border-transparent text-gray-500 bg-white hover:bg-red-100 rounded-lg text-sm font-medium px-5 py-2.5 hover:text-red-900 focus:z-10 dark:bg-transparent dark:text-gray-300 dark:hover:text-white dark:hover:bg-red-600"
        >
          Delete Workspace
        </button>
      </div>
    </>
  );
}
