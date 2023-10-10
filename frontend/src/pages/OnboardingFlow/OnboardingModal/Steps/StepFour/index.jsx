import React, { useState } from "react";

// How many people will be using your instance step
export default function StepFour() {
  const [selected, setSelected] = useState(null);
  const handleClicked = (e) => {
    setSelected(e.target.value);
  };

  const selectedClasses =
    "border-white/60 bg-menu-item-selected-gradient border-slate-100 border-opacity-50 border-transparent border text-white";
  return (
    <div className="flex flex-col justify-center items-center px-16 py-20">
      <div className="w-80 text-white text-center text-2xl font-base">
        How many people will be using your instance?
      </div>
      <div className="flex gap-4 justify-center my-8">
        <button
          value="1"
          onClick={handleClicked}
          className={`${
            selected === "1" ? selectedClasses : "bg-white text-neutral-800"
          } text-sm font-bold px-8 py-2.5 rounded-lg transition-all duration-300 hover:text-white hover:border-white/60 hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border`}
        >
          Just Me
        </button>
        <button
          value="2"
          onClick={handleClicked}
          className={`${
            selected === "2" ? selectedClasses : "bg-white text-neutral-800"
          } text-sm font-bold px-5 py-2.5 rounded-lg transition-all duration-300 hover:text-white hover:border-white/60 hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border`}
        >
          My Team
        </button>
      </div>
    </div>
  );
}
