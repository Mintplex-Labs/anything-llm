import React, { useEffect, useState } from "react";
import Button from "@/components/Generic/Buttons/Button";
import OptionSelect from "@/components/WorkspaceChat/ChatContainer/MetaInputs/OptionSelect";
import { Cursor, Keyboard, List, X } from "@phosphor-icons/react";
import PromptInput from "../PromptInput";
import RangeSlider from "./RangeSlider";
import Rating from "./Rating";
// import DatePicker from './DatePicker';
// import TimePicker from './TimePicker';
// import DateTimePicker from './DateTimePicker';
// import FileUpload from './FileUpload';

const inputComponents = {
  text: PromptInput,
  options: OptionSelect,
  checkbox: OptionSelect,
  list: OptionSelect,
  buttons: OptionSelect,
  dropdown: OptionSelect,
  range: RangeSlider,
  rating: Rating,
  //   date: DatePicker,
  //   time: TimePicker,
  //   datetime: DateTimePicker,
  //   file: FileUpload,
};

const MetaInputs = ({
  inputs,
  submit,
  setMessage,
  workspace,
  message,
  onChange,
  inputDisabled,
  buttonDisabled,
  sendCommand,
}) => {
  const [isForcedTextInput, setIsForcedTextInput] = useState(false);
  const [slideMetaInputs, setSlideMetaInputs] = useState("");
  const [revileMetaInputsShowButton, setRevileMetaInputsShowButton] =
    useState("opacity-0");

  useEffect(() => {
    setIsForcedTextInput(inputs?.type === "text");
  }, [inputs]);

  // Select the appropriate input component based on inputs.type or force text input
  const InputComponent =
    inputs && (isForcedTextInput || inputs.type === "text")
      ? inputComponents["text"]
      : inputComponents[inputs?.type] || null;

  // Condition to show the dynamic input or the forced text input
  const shouldShowMetaInputs =
    workspace?.metaResponse && inputs !== undefined && !isForcedTextInput;

  return (
    <>
      <div
        className={` w-full md:px-2 fixed md:absolute bottom-0 left-0 z-10 md:z-0 flex flex-col justify-center items-center transition-all ease-in-out shadow-lg ${revileMetaInputsShowButton}  `}
      >
        <div className="w-full md:w-[700px]  backdrop-blur-sm rounded-t-xl  pt-3 pb-6 px-1 border-l border-t border-r border-black/20">
          <div className="  ">
            <button
              type="button"
              className=" relative left-0 z-10 text-right md:mb-0 transition-all w-fit duration-300 px-3 py-2.5  text-white text-xs items-center flex gap-x-2  hover:text-white/60 focus:ring-gray-800"
              onClick={() => {
                setSlideMetaInputs(
                  slideMetaInputs == "translate-y-72 scale-y-0"
                    ? ""
                    : "translate-y-72 scale-y-0"
                );
                setRevileMetaInputsShowButton(
                  revileMetaInputsShowButton == "opacity-0" ? "" : "opacity-0"
                );
              }}
            >
              <>
                <List className="w-4 h-4" /> Show buttons
              </>
            </button>
          </div>
        </div>
      </div>
      <div
        className={` w-full md:px-2 fixed md:absolute bottom-10 left-0 z-10 md:z-0 flex flex-col justify-center items-center transition-all ease-in-out duration-300  ${slideMetaInputs}`}
      >
        <div className=" md:w-[700px] w-full  ">
          <button
            type="button"
            className=" absolute ml-2 top-2 z-10 text-right mb-2 md:mb-0 transition-all w-fit duration-300 px-2 py-2  text-white text-xs items-center flex gap-x-2 shadow-sm hover:text-white/60 focus:ring-gray-800"
            onClick={() => {
              setSlideMetaInputs(
                slideMetaInputs == "translate-y-72 scale-y-0"
                  ? ""
                  : "translate-y-72 scale-y-0"
              );
              setRevileMetaInputsShowButton(
                revileMetaInputsShowButton == "opacity-0" ? "" : "opacity-0"
              );
            }}
            icon={X}
          >
            <>
              <X className="w-4 h-4" />
            </>
          </button>
        </div>

        <div className={`w-full md:w-[700px] `}>
          {workspace?.metaResponse && inputs != undefined && (
            <div className="w-full backdrop-blur-sm absolute -bottom-10 md:-bottom-8 left-0 z-10 md:z-0 flex justify-center items-center gap-6">
              <Button
                type="button"
                className="mb-2 md:mb-0 transition-all w-fit duration-300 px-5 py-2.5 rounded-lg text-white/40 text-xs items-center flex gap-x-2 shadow-sm hover:text-white/60 focus:ring-gray-800"
                onClick={() => setIsForcedTextInput(!isForcedTextInput)}
              >
                {isForcedTextInput ? (
                  <>
                    <Cursor className="h-4 w-4" /> Use{" "}
                    {inputs?.settings?.displayType || inputs?.type}
                  </>
                ) : (
                  <>
                    <Keyboard className="h-5 w-5" /> Ues Keyboard
                  </>
                )}
              </Button>
            </div>
          )}

          {shouldShowMetaInputs ? (
            <InputComponent
              submit={submit}
              setMessage={setMessage}
              message={message}
              workspace={workspace}
              onChange={onChange}
              inputDisabled={inputDisabled}
              buttonDisabled={buttonDisabled}
              sendCommand={sendCommand}
              {...inputs}
            />
          ) : (
            <PromptInput
              className={
                inputs === undefined ? "-bottom-2" : "bottom-8 md:-bottom-5"
              }
              workspace={workspace}
              message={message}
              submit={submit}
              onChange={onChange}
              inputDisabled={inputDisabled}
              buttonDisabled={buttonDisabled}
              sendCommand={sendCommand}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MetaInputs;
