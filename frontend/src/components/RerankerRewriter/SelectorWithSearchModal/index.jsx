import React, { useEffect, useRef, useState } from "react";
import { MagnifyingGlass, X, CaretUpDown } from "@phosphor-icons/react";

function RerankerRewriterItem({
  name,
  value,
  image,
  description,
  checked,
  onClick,
}) {
  return (
    <div
      onClick={() => onClick(value)}
      className={`w-full p-2 rounded-md hover:cursor-pointer hover:bg-theme-bg-secondary ${
        checked ? "bg-theme-bg-secondary" : ""
      }`}
    >
      <input
        type="checkbox"
        value={value}
        className="peer hidden"
        checked={checked}
        readOnly={true}
        formNoValidate={true}
      />
      <div className="flex gap-x-4 items-center">
        <img
          src={image}
          alt={`${name} logo`}
          className="w-10 h-10 rounded-md"
        />
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-white custom-text-secondary">{name}</div>
          <div className="mt-1 text-xs text-description custom-text-secondary">{description}</div>
        </div>
      </div>
    </div>
  );
}

const SelectorWithSearchModal = ({
  allOptions,
  updateChoice,
  selectedOptionValue,
  searchInputPlaceholder = "",
}) => {
  const searchInputRef = useRef(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState({});
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleXButton = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchModalOpen(!searchModalOpen);
    }
  };
  const handleSelect = (choice) => {
    setSearchQuery("");
    updateChoice(choice);
    setSearchModalOpen(false);
  };

  useEffect(() => {
    const filtered = allOptions.filter((option) =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchQuery, selectedOptionValue, allOptions]);

  useEffect(() => {
    let target = allOptions?.find(
      (option) => option.value === selectedOptionValue
    );
    if (!target) {
      target = allOptions?.[0];
      handleSelect(target?.value);
    }
    setSelectedOption(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptionValue]);

  const SearchModalBody = (
    <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] overflow-auto white-scrollbar min-h-[64px] bg-theme-settings-input-bg rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20">
      <div className="w-full flex flex-col gap-y-1">
        <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-theme-settings-input-bg">
          <MagnifyingGlass
            size={20}
            weight="bold"
            className="absolute left-4 z-30 text-theme-text-primary -ml-4 my-2 custom-text-secondary"
          />
          <input
            type="text"
            autoComplete="off"
            placeholder={searchInputPlaceholder}
            className="border-none -ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none text-theme-text-primary custom-theme-bg-tertiary custom-text-secondary placeholder:font-medium"
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
          <X
            size={20}
            weight="bold"
            className="cursor-pointer text-white hover:text-x-button custom-text-secondary"
            onClick={handleXButton}
          />
        </div>
        <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4">
          {filteredOptions.map((option) => (
            <RerankerRewriterItem
              key={option?.name}
              name={option?.name}
              value={option?.value}
              image={option?.logo}
              description={option?.description}
              checked={selectedOptionValue === option?.value}
              onClick={() => handleSelect(option?.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
  const SelectedOptionButton = (
    <button
      className="w-full max-w-[640px] h-[64px] bg-theme-settings-input-bg rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300"
      type="button"
      onClick={() => setSearchModalOpen(true)}
    >
      <div className="flex gap-x-4 items-center">
        <img
          src={selectedOption?.logo}
          alt={`${selectedOption?.name} logo`}
          className="w-10 h-10 rounded-md"
        />
        <div className="flex flex-col text-left">
          <div className="text-sm font-semibold text-white custom-text-secondary">
            {selectedOption?.name}
          </div>
          <div className="mt-1 text-xs text-description custom-text-secondary">
            {selectedOption?.description}
          </div>
        </div>
      </div>
      <CaretUpDown size={24} weight="bold" className="text-white custom-text-secondary" />
    </button>
  );
  return (
    <div className="relative">
      {searchModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
          onClick={() => searchModalOpen(false)}
        />
      )}
      {searchModalOpen ? SearchModalBody : SelectedOptionButton}
    </div>
  );
};

export default SelectorWithSearchModal;
