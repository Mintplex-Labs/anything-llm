import pluralize from "pluralize";
import React, { useEffect, useState } from "react";
import System from "@/models/system";
import { numberWithCommas } from "@/utils/numbers";

export default function IndexCount() {
  const [indexes, setIndexes] = useState(null);
  useEffect(() => {
    async function indexCount() {
      setIndexes(await System.totalIndexes());
    }
    indexCount();
  }, []);

  if (indexes === null || indexes === 0) {
    return (
      <div className="flex w-full items-center justify-end gap-x-2">
        <div className="flex items-center gap-x-1 px-2 rounded-full">
          <p className="text-slate-400 leading-tight text-sm"></p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-end gap-x-2">
      <div className="flex items-center gap-x-1  px-2 rounded-full">
        <p className="text-slate-400 leading-tight text-sm">
          {numberWithCommas(indexes)} {pluralize("vector", indexes)}
        </p>
      </div>
    </div>
  );
}
