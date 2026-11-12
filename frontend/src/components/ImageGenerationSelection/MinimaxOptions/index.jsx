import { Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import ImageModelSelection from "../ImageModelSelection";
import ImageDimensionSelection from "../ImageDimensionSelection";

const RESOLUTIONS = ["1K", "2K", "4K"];

const INPUT_CLASSES =
  "border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5";

export default function MinimaxImageOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex flex-wrap items-start gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="ImageGenerationMinimaxApiKey"
            className={INPUT_CLASSES}
            placeholder="MiniMax API Key"
            defaultValue={
              settings?.ImageGenerationMinimaxApiKey ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <ImageModelSelection provider="minimax-imggen" settings={settings} />
        <ImageDimensionSelection
          provider="minimax-imggen"
          settings={settings}
        />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Resolution
          </label>
          <select
            name="ImageGenerationMinimaxResolution"
            className={INPUT_CLASSES}
            defaultValue={settings?.ImageGenerationMinimaxResolution}
          >
            {RESOLUTIONS.map((resolution) => (
              <option key={resolution} value={resolution}>
                {resolution}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-60">
          <div className="flex items-center gap-1 mb-3">
            <label className="text-white text-sm font-semibold">
              Prompt Enhancement
            </label>
            <Info
              size={18}
              className="text-theme-text-secondary cursor-pointer"
              data-tooltip-id="image-gen-minimax-prompt-enhancement"
            />
            <Tooltip
              id="image-gen-minimax-prompt-enhancement"
              place="top"
              delayShow={300}
              delayHide={800}
              clickable={true}
              className="tooltip !text-xs !opacity-100 z-99"
              style={{
                maxWidth: "250px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              MiniMax rewrites your prompt into a more detailed one before
              generating the image. This usually improves results, but the
              rewritten prompt is billed as extra input tokens.
              <br />
              <br />
              When disabled, your prompt is used exactly as written and the Auto
              aspect ratio falls back to 1:1. Image edits always use prompt
              enhancement.
            </Tooltip>
          </div>
          <select
            name="ImageGenerationMinimaxPromptEnhancement"
            className={INPUT_CLASSES}
            defaultValue={settings?.ImageGenerationMinimaxPromptEnhancement}
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
      </div>
    </div>
  );
}
