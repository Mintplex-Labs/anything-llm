import { ArrowCircleUpRight } from "@phosphor-icons/react";

export default function Resources() {
  return (
    <div>
      <h1 className="text-white uppercase text-sm font-semibold mb-4">
        Resources
      </h1>
      <div className="flex gap-x-6">
        <a
          href="#"
          className="text-white text-sm flex items-center gap-x-2 hover:opacity-70"
        >
          Docs
          <ArrowCircleUpRight weight="fill" size={16} />
        </a>
        <a
          href="#"
          className="text-white text-sm flex items-center gap-x-2 hover:opacity-70"
        >
          Tutorials
          <ArrowCircleUpRight weight="fill" size={16} />
        </a>
        <a
          href="#"
          className="text-white text-sm flex items-center gap-x-2 hover:opacity-70"
        >
          Github
          <ArrowCircleUpRight weight="fill" size={16} />
        </a>
      </div>
    </div>
  );
}
