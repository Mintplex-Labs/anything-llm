import React, { useEffect, useState } from "react";
import { WarningCircle, Circle } from "@phosphor-icons/react";
import System from "../../models/system";

export default function LLMStatus() {
  const [status, setStatus] = useState(null);
  useEffect(() => {
    async function checkPing() {
      setStatus(await System.ping());
    }
    checkPing();
  }, []);

  if (status === null) {
    return (
      <div className="flex w-full items-center justify-start gap-x-2">
        <p className="text-slate-400 leading-loose text-sm">LLM</p>
        <div className="flex items-center gap-x-1 border border-slate-400 px-2 rounded-full">
          <p className="text-slate-400 leading-tight text-sm">unknown</p>
          <Circle className="h-3 w-3 stroke-slate-700 fill-slate-400 animate-pulse" />
        </div>
      </div>
    );
  }

  // TODO: add modal or toast on click to identify why this is broken
  // need to likely start server.
  if (status === false) {
    return (
      <div className="flex w-full items-center justify-end gap-x-2">
        <p className="text-slate-400 leading-loose text-sm">LLM</p>
        <div className="flex items-center gap-x-1 border border-red-400 px-2 bg-red-200 rounded-full">
          <p className="text-red-700 leading-tight text-sm">offline</p>
          <WarningCircle className="h-3 w-3 stroke-red-100 fill-red-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-end gap-x-2">
      <p className="text-slate-400 leading-loose text-sm">LLM</p>
      <div className="flex items-center gap-x-1 border border-slate-400 px-2 rounded-full">
        <p className="text-slate-400 leading-tight text-sm">online</p>
        <Circle className="h-3 w-3 stroke-green-100 fill-green-400 animate-pulse" />
      </div>
    </div>
  );
}
