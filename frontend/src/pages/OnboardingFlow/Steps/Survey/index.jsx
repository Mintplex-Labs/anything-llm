import {
  COMPLETE_QUESTIONNAIRE,
  ONBOARDING_SURVEY_URL,
} from "@/utils/constants";
import paths from "@/utils/paths";
import { CheckCircle } from "@phosphor-icons/react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

async function sendQuestionnaire({ email, useCase, comment }) {
  if (import.meta.env.DEV) {
    console.log("sendQuestionnaire", { email, useCase, comment });
    return;
  }

  const data = JSON.stringify({
    email,
    useCase,
    comment,
    sourceId: "0VRjqHh6Vukqi0x0Vd0n/m8JuT7k8nOz",
  });

  if (!navigator.sendBeacon) {
    console.log("navigator.sendBeacon not supported, falling back to fetch");
    return fetch(ONBOARDING_SURVEY_URL, {
      method: "POST",
      body: data,
    })
      .then(() => {
        window.localStorage.setItem(COMPLETE_QUESTIONNAIRE, true);
        console.log(`✅ Questionnaire responses sent.`);
      })
      .catch((error) => {
        console.error(`sendQuestionnaire`, error.message);
      });
  }

  navigator.sendBeacon(ONBOARDING_SURVEY_URL, data);
  window.localStorage.setItem(COMPLETE_QUESTIONNAIRE, true);
  console.log(`✅ Questionnaire responses sent.`);
}

export default function Survey({ setHeader, setForwardBtn, setBackBtn }) {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();
  const submitRef = useRef(null);

  const TITLE = t("onboarding.survey.title");
  const DESCRIPTION = t("onboarding.survey.description");

  function handleForward() {
    if (!!window?.localStorage?.getItem(COMPLETE_QUESTIONNAIRE)) {
      navigate(paths.onboarding.createWorkspace());
      return;
    }

    if (!formRef.current) {
      skipSurvey();
      return;
    }

    // Check if any inputs are not empty. If that is the case, trigger form validation.
    // via the requestSubmit() handler
    const formData = new FormData(formRef.current);
    if (
      !!formData.get("email") ||
      !!formData.get("use_case") ||
      !!formData.get("comment")
    ) {
      formRef.current.requestSubmit();
      return;
    }

    skipSurvey();
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
        <div className="card-hemp flex items-center justify-center px-1 md:px-8 py-4">
          <div className="w-auto flex flex-col gap-y-1 items-center">
            <CheckCircle size={60} className="text-hemp-primary" />
            <p className="text-hemp-text text-lg">
              {t("onboarding.survey.thankYou")}
            </p>
            <a
              href={paths.mailToMintplex()}
              className="text-hemp-secondary underline text-xs hover:text-hemp-primary transition-colors"
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
      <div className="card-hemp max-w-2xl w-full">
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="md:min-w-[400px]">
            <label
              htmlFor="email"
              className="text-hemp-text text-base font-medium"
            >
              {t("onboarding.survey.email")}{" "}
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@gmail.com"
              required={true}
              className="input-hemp mt-2 h-11"
            />
          </div>

          <div className="mt-8">
            <label
              className="text-hemp-text text-base font-medium"
              htmlFor="use_case"
            >
              {t("onboarding.survey.useCase")}{" "}
            </label>
            <div className="mt-2 gap-y-3 flex flex-col">
              <label
                className={`border-solid transition-all duration-300 w-full h-11 p-2.5 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border ${
                  selectedOption === "job"
                    ? "border-hemp-primary bg-hemp-warm"
                    : "border-hemp-accent"
                } hover:border-hemp-primary hover:bg-hemp-warm`}
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
                  className={`w-4 h-4 rounded-full border-2 border-hemp-accent mr-2 ${
                    selectedOption === "job" ? "bg-hemp-primary" : ""
                  }`}
                ></div>
                <div className="text-hemp-text text-sm font-medium leading-tight">
                  {t("onboarding.survey.useCaseWork")}
                </div>
              </label>
              <label
                className={`border-solid transition-all duration-300 w-full h-11 p-2.5 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border ${
                  selectedOption === "personal"
                    ? "border-hemp-primary bg-hemp-warm"
                    : "border-hemp-accent"
                } hover:border-hemp-primary hover:bg-hemp-warm`}
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
                  className={`w-4 h-4 rounded-full border-2 border-hemp-accent mr-2 ${
                    selectedOption === "personal" ? "bg-hemp-primary" : ""
                  }`}
                ></div>
                <div className="text-hemp-text text-sm font-medium leading-tight">
                  {t("onboarding.survey.useCasePersonal")}
                </div>
              </label>
              <label
                className={`border-solid transition-all duration-300 w-full h-11 p-2.5 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border ${
                  selectedOption === "other"
                    ? "border-hemp-primary bg-hemp-warm"
                    : "border-hemp-accent"
                } hover:border-hemp-primary hover:bg-hemp-warm`}
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
                  className={`w-4 h-4 rounded-full border-2 border-hemp-accent mr-2 ${
                    selectedOption === "other" ? "bg-hemp-primary" : ""
                  }`}
                ></div>
                <div className="text-hemp-text text-sm font-medium leading-tight">
                  {t("onboarding.survey.useCaseOther")}
                </div>
              </label>
            </div>
          </div>

          <div className="mt-8">
            <label
              htmlFor="comment"
              className="text-hemp-text text-base font-medium"
            >
              {t("onboarding.survey.comment")}{" "}
              <span className="text-hemp-earth text-base font-light">
                ({t("common.optional")})
              </span>
            </label>
            <textarea
              name="comment"
              rows={5}
              className="input-hemp mt-2 resize-none"
              placeholder={t("onboarding.survey.commentPlaceholder")}
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
              className="text-hemp-earth text-base font-medium hover:text-hemp-primary mt-8 transition-colors"
            >
              {t("onboarding.survey.skip")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
