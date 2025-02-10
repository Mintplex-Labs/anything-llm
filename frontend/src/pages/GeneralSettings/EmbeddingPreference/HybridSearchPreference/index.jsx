import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Info, WarningDiamond } from "@phosphor-icons/react";
import { sparseEmbeddingProviderOptions } from "@/pages/GeneralSettings/EmbeddingPreference";

const INPUT_CONFIGS = {
  baseUrl: {
    label: "Base URL",
    inputProps: {
      type: "url",
      name: "SparseEmbeddingBasePath",

      placeholder: "https://api.openai.com/v1",
      required: true,
      autoComplete: "off",
      spellCheck: false,
    },
  },
  embeddingModel: {
    label: "Embedding Model",
    inputProps: {
      type: "text",
      name: "SparseEmbeddingModelPref",
      placeholder: "text-embedding-ada-002",
      required: true,
      autoComplete: "off",
      spellCheck: false,
    },
  },
  denseEmbedderWeight: {
    label: "Dense Vector Weight",
    inputProps: {
      type: "number",
      max: 1,
      min: 0,
      step: 0.01,
      name: "HybridSearchDenseVectorWeight",
      placeholder: 0.8,
      required: true,
      autoComplete: "off",
      spellCheck: false,
    },
  },
  sparseEmbedderWeight: {
    label: "Sparse Vector Weight",
    inputProps: {
      type: "number",
      max: 1,
      min: 0,
      step: 0.01,
      name: "HybridSearchSparseVectorWeight",
      placeholder: 0.2,
      required: true,
      autoComplete: "off",
      spellCheck: false,
    },
  },
  apiKey: {
    label: (
      <div className="flex flex-col gap-y-1 mb-4">
        <label className="text-white text-sm font-semibold flex items-center gap-x-2">
          API Key <p className="!text-xs !italic !font-thin">optional</p>
        </label>
      </div>
    ),
    hideValue: true,
    inputProps: {
      type: "password",
      name: "SparseGenericOpenAiEmbeddingApiKey",
      required: false,
      placeholder: "sk-mysecretkey",
      autoComplete: "off",
      spellCheck: false,
    },
  },
};

function reverseOrder(arr = []) {
  let reversed = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
  }
  return reversed;
}

const HybridSearchPreference = ({
  settings,
  onChange,
  weightError,
  sparseEmbeddingProviderType,
  setSparseEmbeddingProviderType,
}) => {
  const { t } = useTranslation();

  const renderInputFields = (inputConfigArr) => (
    <div className="w-full flex items-center gap-[36px] mt-1.5 flex-wrap">
      {inputConfigArr?.map((config, index) => {
        let defaultValue = settings?.[config?.inputProps?.name];
        if (config?.hideValue) {
          defaultValue = defaultValue ? "*".repeat(20) : "";
        }
        return (
          <div
            className="flex flex-col w-60"
            key={`${index}-${config.inputProps?.name}`}
          >
            {typeof config?.label === "string" ? (
              <label className="text-white text-sm font-semibold block mb-3">
                {config.label}
              </label>
            ) : (
              config.label
            )}
            <input
              {...config?.inputProps}
              defaultValue={defaultValue}
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            />
          </div>
        );
      })}
    </div>
  );
  const defaultChecked = settings?.HybridSearchEnabled === "true";
  const [isHybridSearchEnabled, setIsHybridSearchEnabled] =
    useState(defaultChecked);

  const isExternalSparseEngineType =
    sparseEmbeddingProviderType?.label ===
    sparseEmbeddingProviderOptions?.[0]?.label;

  return (
    <div className="flex flex-col gap-[24px]" onChange={onChange}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="text-base font-bold text-white custom-text-secondary">
            {t("embedding.hybrid-search.title")}
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              id="HybridSearchEnabled"
              type="checkbox"
              name="HybridSearchEnabled"
              defaultChecked={defaultChecked}
              onChange={() =>
                setIsHybridSearchEnabled((previousState) => !previousState)
              }
              className="peer sr-only"
            />
            <div className="pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
          </label>
        </div>
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 custom-text-secondary">
          {t("embedding.hybrid-search.desc")}
        </p>
      </div>
      {isHybridSearchEnabled && (
        <div className="space-y-2">
          <div className="text-base font-bold text-white custom-text-secondary">
            {t("embedding.provider.sparseTitle")}
          </div>

          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3 custom-text-secondary mt-1.5">
              Sparse Engine Type
            </label>
            <select
              name="SparseEngineType"
              required={true}
              onChange={(e) => {
                const _selected = sparseEmbeddingProviderOptions?.find(
                  (value) => value?.label === e?.target?.value
                );
                setSparseEmbeddingProviderType(_selected);
              }}
              className="w-full border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block p-2.5 capitalize custom-theme-bg-tertiary custom-text-secondary custom-border-secondary"
            >
              <optgroup label="Available sparse engine types">
                {reverseOrder(sparseEmbeddingProviderOptions)?.map((model) => {
                  return (
                    <option
                      key={model?.key}
                      id={model?.key}
                      value={model?.label}
                      selected={sparseEmbeddingProviderType?.key === model?.key}
                    >
                      {model?.label}
                    </option>
                  );
                })}
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col gap-[24px] custom-llm-provider-modal">
            {isExternalSparseEngineType && (
              <>
                {renderInputFields([
                  INPUT_CONFIGS.baseUrl,
                  INPUT_CONFIGS.embeddingModel,
                  INPUT_CONFIGS.apiKey,
                ])}
              </>
            )}
            {renderInputFields([
              INPUT_CONFIGS.denseEmbedderWeight,
              INPUT_CONFIGS.sparseEmbedderWeight,
            ])}

            <p
              className={`flex items-center gap-2 text-xs leading-[18px] font-base ${weightError ? "text-danger" : "text-white text-opacity-60 "}`}
            >
              {weightError ? (
                <WarningDiamond className="w-6 h-6" />
              ) : (
                <Info className="w-6 h-6" />
              )}
              {t("embedding.hybrid-search.weightInfo")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HybridSearchPreference;
