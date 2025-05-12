import { memo, useState } from "react";
import { v4 } from "uuid";
import { middleTruncate } from "@/utils/directories";
import {
  CaretRight,
  FileText,
  Link,
  YoutubeLogo,
  GithubLogo,
} from "@phosphor-icons/react";
import ConfluenceLogo from "@/media/dataConnectors/confluence.png";
import DrupalWikiLogo from "@/media/dataConnectors/drupalwiki.png";

export default function Citations({ sources = [] }) {
  if (sources.length === 0) return null;

  console.log("Sources received by Citations component:", sources); // Debugging log

  const [open, setOpen] = useState(true); // Default to open

  return (
    <div className="flex flex-col mt-4 justify-left">
      <button
        onClick={() => setOpen(!open)}
        className={`border-none text-white/50 light:text-black/50 font-medium italic text-sm text-left ml-14 pt-2 ${
          open ? "pb-2" : ""
        } hover:text-white/75 hover:light:text-black/75 transition-all duration-300`}
      >
        {open ? "Hide Links" : "Show Links"}
        <CaretRight
          className={`w-3.5 h-3.5 inline-block ml-1 transform transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      {open && (
        <div className="flex flex-wrap md:flex-row md:items-stretch gap-4 overflow-x-scroll mt-1 doc__source ml-14">
          {sources.map((source) => (
            <Citation key={v4()} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}

const Citation = memo(({ source }) => {
  const { title, product_image, url, docAuthor } = source; // Include seller/author metadata
  if (!title) return null;

  console.log("Rendering citation as product card:", { title, product_image, url, docAuthor }); // Debugging log

  return (
    <div className="w-64 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 flex flex-col">
      <a
        href={url || "#"}
        target="_blank"
        rel="noreferrer"
        className="block"
      >
        {product_image ? ( // Display product image if available
          <img
            src={product_image}
            alt={title}
            className="w-full h-40 object-contain"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </a>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <a
          href={url || "#"}
          target="_blank"
          rel="noreferrer"
          className="block text-lg font-semibold text-gray-800 hover:text-blue-500 transition"
        >
          {title}
        </a>
        {docAuthor && (
          <p className="text-sm text-gray-500 mt-2">Sold by {docAuthor}</p>
        )}
      </div>
    </div>
  );
});

Citation.displayName = "Citation";

// Patch to render Confluence icon as an element like we do with Phosphor
const ConfluenceIcon = ({ ...props }) => (
  <img src={ConfluenceLogo} {...props} />
);

// Patch to render DrupalWiki icon as an element like we do with Phosphor
const DrupalWikiIcon = ({ ...props }) => (
  <img src={DrupalWikiLogo} {...props} />
);

const ICONS = {
  file: FileText,
  link: Link,
  youtube: YoutubeLogo,
  github: GithubLogo,
  confluence: ConfluenceIcon,
  drupalwiki: DrupalWikiIcon,
};
