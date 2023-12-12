import { COMPLETE_QUESTIONNAIRE } from "@/utils/constants";
import paths from "@/utils/paths";
import { CheckCircle, Circle } from "@phosphor-icons/react";
import React, { memo } from "react";

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

function UserQuestionnaire({ nextStep, prevStep }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    nextStep("create_workspace");

    await sendQuestionnaire({
      email: formData.get("email"),
      useCase: formData.get("use_case") || "other",
      comment: formData.get("comment") || null,
    });
    return;
  };

  const handleSkip = () => {
    nextStep("create_workspace");
  };

  if (!!window?.localStorage?.getItem(COMPLETE_QUESTIONNAIRE)) {
    return (
      <div className="w-full">
        <div className="w-full flex items-center justify-center px-1 md:px-8 py-4">
          <div className="w-auto flex flex-col gap-y-1 items-center">
            <CheckCircle size={60} className="text-green-500" />
            <p className="text-zinc-300">Thank you for your feedback!</p>
            <a
              href={paths.mailToMintplex()}
              className="text-blue-400 underline text-xs"
            >
              team@mintplexlabs.com
            </a>
          </div>
        </div>

        <div className="flex w-full justify-between items-center px-6 py-4 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            onClick={prevStep}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
          >
            Back
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              type="button"
              className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
            >
              Skip
            </button>
            <button
              type="submit"
              className="border px-4 py-2 rounded-lg text-sm items-center flex gap-x-2
              border-slate-200 text-slate-800 bg-slate-200 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow
              disabled:border-gray-400 disabled:text-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form className="flex flex-col w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full px-1 md:px-8 py-4">
          <div className="w-full flex flex-col gap-y-2 my-5">
            <div className="w-80">
              <div className="flex flex-col mb-3 ">
                <label htmlFor="email" className="block font-medium text-white">
                  What is your email?
                </label>
              </div>
              <input
                name="email"
                type="email"
                className="bg-zinc-900 text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 placeholder-white placeholder-opacity-60 focus:ring-blue-500"
                placeholder="you@gmail.com"
                required={true}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-y-2 my-5">
            <div className="w-full">
              <div className="flex flex-col mb-3 ">
                <label
                  htmlFor="use_case"
                  className="block font-medium text-white"
                >
                  How are you planning to use AnythingLLM?
                </label>
              </div>

              <div className="flex flex-col gap-y-2">
                <div class="flex items-center ps-4 border border-zinc-400 rounded group radio-container hover:bg-blue-400/10">
                  <input
                    id="bordered-radio-1"
                    type="radio"
                    value="business"
                    name="use_case"
                    class="sr-only peer"
                  />
                  <Circle
                    weight="fill"
                    className="fill-transparent border border-gray-300 rounded-full peer-checked:fill-blue-500 peer-checked:border-none"
                  />
                  <label
                    for="bordered-radio-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-300"
                  >
                    For my business
                  </label>
                </div>
                <div class="flex items-center ps-4 border border-zinc-400 rounded group radio-container hover:bg-blue-400/10">
                  <input
                    id="bordered-radio-2"
                    type="radio"
                    value="personal"
                    name="use_case"
                    class="sr-only peer"
                  />
                  <Circle
                    weight="fill"
                    className="fill-transparent border border-gray-300 rounded-full peer-checked:fill-blue-500 peer-checked:border-none"
                  />
                  <label
                    for="bordered-radio-2"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-300"
                  >
                    For personal use
                  </label>
                </div>
                <div class="flex items-center ps-4 border border-zinc-400 rounded group radio-container hover:bg-blue-400/10">
                  <input
                    id="bordered-radio-3"
                    type="radio"
                    value="other"
                    name="use_case"
                    class="sr-only peer"
                  />
                  <Circle
                    weight="fill"
                    className="fill-transparent border border-gray-300 rounded-full peer-checked:fill-blue-500 peer-checked:border-none"
                  />
                  <label
                    for="bordered-radio-3"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-300"
                  >
                    I'm not sure yet
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-y-2 my-5">
            <div className="w-full">
              <div className="flex flex-col mb-3 ">
                <label
                  htmlFor="comments"
                  className="block font-medium text-white"
                >
                  Any comments for the team?
                </label>
              </div>
              <textarea
                name="comment"
                rows={5}
                className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="If you have any questions or comments right now, you can leave them here and we will get back to you. You can also email team@mintplexlabs.com"
                wrap="soft"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <div className="flex w-full justify-between items-center px-6 py-4 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            onClick={prevStep}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
          >
            Back
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              type="button"
              className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
            >
              Skip
            </button>
            <button
              type="submit"
              className="border px-4 py-2 rounded-lg text-sm items-center flex gap-x-2
              border-slate-200 text-slate-800 bg-slate-200 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow
              disabled:border-gray-400 disabled:text-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default memo(UserQuestionnaire);
