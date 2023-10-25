import React, { memo } from "react";

// How many people will be using your instance step
function UserModeSelection({ goToStep, prevStep }) {
  const justMeClicked = () => {
    goToStep(5);
  };

  const myTeamClicked = () => {
    goToStep(6);
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center px-20 py-20">
        <div className="w-80 text-white text-center text-2xl font-base">
          How many people will be using your instance?
        </div>
        <div className="flex gap-4 justify-center my-8">
          <button
            onClick={justMeClicked}
            className="transition-all duration-200 border border-slate-200 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 text-sm items-center flex gap-x-2 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
          >
            Just Me
          </button>
          <button
            onClick={myTeamClicked}
            className="transition-all duration-200 border border-slate-200 px-5 py-2.5 rounded-lg text-slate-800 bg-slate-200 text-sm items-center flex gap-x-2 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
          >
            My Team
          </button>
        </div>
      </div>
      <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
        <button
          onClick={prevStep}
          type="button"
          className="px-4 py-2 rounded-lg text-white hover:bg-sidebar transition-all duration-300"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default memo(UserModeSelection);
