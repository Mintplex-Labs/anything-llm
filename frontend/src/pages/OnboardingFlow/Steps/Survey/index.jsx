import { COMPLETE_QUESTIONNAIRE } from "@/utils/constants";
import paths from "@/utils/paths";
import { CheckCircle } from "@phosphor-icons/react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TITLE = "Welcome to AnythingLLM";
const DESCRIPTION = "Help us make AnythingLLM built for your needs. Optional.";

async function sendQuestionnaire({ email, useCase, comment }) {
  if (import.meta.env.DEV) return;
  return fetch(`https://onboarding-wxich7363q-uc.a.run.app`, {
    method: "POST",
    body: JSON.stringify({
      email,
      useCase,
      comment,
      sourceId: "0VRjqHh6Vukqi0x0Vd0n/m8JuT7k8nOz",
    }),
  })
    .then(() => {
      window.localStorage.setItem(COMPLETE_QUESTIONNAIRE, true);
      console.log(`✅ Questionnaire responses sent.`);
    })
    .catch((error) => {
      console.error(`sendQuestionnaire`, error.message);
    });
}

export default function Survey({ setHeader, setForwardBtn, setBackBtn }) {
  const [selectedOption, setSelectedOption] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();
  const submitRef = useRef(null);

  function handleForward() {
    if (!!window?.localStorage?.getItem(COMPLETE_QUESTIONNAIRE)) {
      navigate(paths.onboarding.createWorkspace());
      return;
    }
    if (submitRef.current) {
      submitRef.current.click();
    }
  }

  function skipSurvey() {
    navigate(paths.onboarding.createWorkspace());
  }

  function handleBack() {
    navigate(paths.onboarding.dataHandling());
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    await sendQuestionnaire({
      email: formData.get("email"),
      useCase: formData.get("use_case") || "other",
      comment: formData.get("comment") || null,
    });

    navigate(paths.onboarding.createWorkspace());
  };

  if (!!window?.localStorage?.getItem(COMPLETE_QUESTIONNAIRE)) {
    return (
      <div className="w-full flex justify-center items-center py-40">
        <div className="w-full flex items-center justify-center px-1 md:px-8 py-4">
          <div className="w-auto flex flex-col gap-y-1 items-center">
            <CheckCircle size={60} className="text-green-500" />
            <p className="text-white text-lg">Thank you for your feedback!</p>
            <a
              href={paths.mailToMintplex()}
              className="text-sky-400 underline text-xs"
            >
              team@mintplexlabs.com
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <form onSubmit={handleSubmit} ref={formRef} className="">
        <div className="md:min-w-[400px]">
          <label htmlFor="email" className="text-white text-base font-medium">
            What's your email?{" "}
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@gmail.com"
            required={true}
            className="mt-2 bg-zinc-900 text-white placeholder:text-white/20 text-sm font-medium font-['Plus Jakarta Sans'] leading-tight w-full h-11 p-2.5 bg-zinc-900 rounded-lg"
          />
        </div>

        <div className="mt-8">
          <label
            className="text-white text-base font-medium"
            htmlFor="use_case"
          >
            What will you use AnythingLLM for?{" "}
          </label>
          <div className="mt-2 gap-y-3 flex flex-col">
            <label
              className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
                selectedOption === "business"
                  ? "border-white border-opacity-40"
                  : ""
              } hover:border-white/60`}
            >
              <input
                type="radio"
                name="use_case"
                value={"business"}
                checked={selectedOption === "business"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
                  selectedOption === "business" ? "bg-white" : ""
                }`}
              ></div>
              <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                For my business
              </div>
            </label>
            <label
              className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
                selectedOption === "personal"
                  ? "border-white border-opacity-40"
                  : ""
              } hover:border-white/60`}
            >
              <input
                type="radio"
                name="use_case"
                value={"personal"}
                checked={selectedOption === "personal"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
                  selectedOption === "personal" ? "bg-white" : ""
                }`}
              ></div>
              <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                For personal use
              </div>
            </label>
            <label
              className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
                selectedOption === "education"
                  ? "border-white border-opacity-40"
                  : ""
              } hover:border-white/60`}
            >
              <input
                type="radio"
                name="use_case"
                value={"education"}
                checked={selectedOption === "education"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
                  selectedOption === "education" ? "bg-white" : ""
                }`}
              ></div>
              <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                For my education
              </div>
            </label>
            <label
              className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
                selectedOption === "side_hustle"
                  ? "border-white border-opacity-40"
                  : ""
              } hover:border-white/60`}
            >
              <input
                type="radio"
                name="use_case"
                value={"side_hustle"}
                checked={selectedOption === "side_hustle"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
                  selectedOption === "side_hustle" ? "bg-white" : ""
                }`}
              ></div>
              <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                For my side-hustle
              </div>
            </label>
            <label
              className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
                selectedOption === "job" ? "border-white border-opacity-40" : ""
              } hover:border-white/60`}
            >
              <input
                type="radio"
                name="use_case"
                value={"job"}
                checked={selectedOption === "job"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
                  selectedOption === "job" ? "bg-white" : ""
                }`}
              ></div>
              <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                For my job
              </div>
            </label>
            <label
              className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
                selectedOption === "other"
                  ? "border-white border-opacity-40"
                  : ""
              } hover:border-white/60`}
            >
              <input
                type="radio"
                name="use_case"
                value={"other"}
                checked={selectedOption === "other"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
                  selectedOption === "other" ? "bg-white" : ""
                }`}
              ></div>
              <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                Other
              </div>
            </label>
          </div>
        </div>

        <div className="mt-8">
          <label htmlFor="comment" className="text-white text-base font-medium">
            Any comments for the team?{" "}
            <span className="text-neutral-400 text-base font-light">
              (Optional)
            </span>
          </label>
          <textarea
            name="comment"
            rows={5}
            className="mt-2 bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="If you have any questions or comments right now, you can leave them here and we will get back to you. You can also email team@mintplexlabs.com"
            wrap="soft"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          ref={submitRef}
          hidden
          aria-hidden="true"
        ></button>

        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            onClick={skipSurvey}
            className="text-white text-base font-medium text-opacity-30 hover:text-opacity-100 mt-8"
          >
            Skip Survey
          </button>
        </div>
      </form>
    </div>
  );
}
