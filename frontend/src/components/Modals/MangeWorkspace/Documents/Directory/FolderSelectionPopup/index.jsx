import { middleTruncate } from "@/utils/directories";

export default function FolderSelectionPopup({ folders, onSelect, onClose }) {
  const handleFolderSelect = (folder) => {
    onSelect(folder);
    onClose();
  };

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg max-h-40 overflow-y-auto no-scroll">
      <ul>
        {folders.map((folder) => (
          <li
            key={folder.name}
            onClick={() => handleFolderSelect(folder)}
            className="px-4 py-2 text-xs text-gray-700 hover:bg-gray-200 rounded-lg cursor-pointer whitespace-nowrap"
          >
            {middleTruncate(folder.name, 25)}
          </li>
        ))}
      </ul>
    </div>
  );
}
