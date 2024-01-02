import React, { useState, useEffect, useRef } from "react";
const TITLE = "Welcome to AnythingLLM";
const DESCRIPTION = "Let's personalize your experience.";
const options = [
  "For my job",
  "For my education",
  "For a personal project",
  "For my side-hustle",
];

export default function Survey({ setHeader, setForwardBtn }) {
  const [name, setName] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const formRef = useRef(null);

  function handleForward() {
    formRef.current && formRef.current.submit();
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Submitted Name: ", name);
    console.log("Selected Option: ", selectedOption);
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div>
        <label htmlFor="nameInput" className="text-white text-base font-medium">
          What's your name?{" "}
          <span className="text-neutral-400 text-base font-light">
            (Optional)
          </span>
        </label>
        <input
          id="nameInput"
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 bg-zinc-900 text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight w-full h-11 p-2.5 bg-zinc-900 rounded-lg"
        />
      </div>

      <div className="mt-8">
        <label className="text-white text-base font-medium">
          What will you use AnythingLLM for?{" "}
          <span className="text-neutral-400 text-base font-light">
            (Optional)
          </span>
        </label>
        <div className="mt-2 gap-y-3 flex flex-col">
          {options.map((option) => (
            <label
              key={option}
              className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
                selectedOption === option
                  ? "border-white border-opacity-40"
                  : ""
              } hover:border-white/60`}
            >
              <input
                type="radio"
                name="usageOption"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
                  selectedOption === option ? "bg-white" : ""
                }`}
              ></div>
              <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                {option}
              </div>
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}
