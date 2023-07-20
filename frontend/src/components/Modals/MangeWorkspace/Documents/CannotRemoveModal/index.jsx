import React from "react";
import { titleCase } from "text-case";

export default function CannotRemoveModal({ hideModal, vectordb }) {
  return (
    <dialog
      open={true}
      style={{ zIndex: 100 }}
      className="fixed top-0 flex bg-black bg-opacity-50 w-[100vw] h-full items-center justify-center "
    >
      <div className="px-10 p-4 w-1/2 rounded-lg bg-white shadow dark:bg-stone-700 text-black dark:text-slate-200">
        <div className="flex flex-col w-full">
          <p className="text-lg font-semibold text-red-500">
            You cannot remove this document!
          </p>

          <div className="flex flex-col gap-y-1">
            <p className="text-base mt-4">
              {titleCase(vectordb)} does not support atomic removal of
              documents.
              <br />
              Unfortunately, you will have to delete the entire workspace to
              remove this document from being referenced.
            </p>
          </div>
          <div className="flex w-full justify-center items-center mt-4">
            <button
              onClick={hideModal}
              className="text-gray-800 hover:bg-gray-100 px-4 py-1 rounded-lg dark:text-slate-200 dark:hover:bg-stone-900"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
