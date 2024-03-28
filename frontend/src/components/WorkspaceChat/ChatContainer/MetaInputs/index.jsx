import React, { useEffect, useState } from "react";
// import TextInput from './TextInput';
import OptionSelect from "@/components/WorkspaceChat/ChatContainer/MetaInputs/OptionSelect";
import { Cursor, Eye, List, Keyboard, X } from "@phosphor-icons/react";
import PromptInput from "../PromptInput";
import RangeSlider from "./RangeSlider";
import Rating from "./Rating";
import Button from "@/components/Generic/Buttons/Button";
import { EyeClosed } from "@phosphor-icons/react/dist/ssr";
// import RangeSlider from './RangeSlider';
// import DatePicker from './DatePicker';
// import TimePicker from './TimePicker';
// import DateTimePicker from './DateTimePicker';
// import FileUpload from './FileUpload';
// import Rating from './Rating';

const inputComponents = {
  text: PromptInput,
  options: OptionSelect,
  checkbox: OptionSelect,
  list: OptionSelect,
  buttons: OptionSelect,
  dropdown: OptionSelect,
  range: RangeSlider,
  //   date: DatePicker,
  //   time: TimePicker,
  //   datetime: DateTimePicker,
  //   file: FileUpload,
  rating: Rating,
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
  const [showMetaInputs, setShowMetaInputs] = useState(true);

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
    <div className=" w-full md:px-4 fixed md:absolute bottom-10 left-0 z-10 md:z-0 flex flex-col justify-center items-center">
      {!showMetaInputs && (
        <Button
          type="button"
          className="text-right -mb-7 md:mb-0 transition-all w-fit duration-300 px-5 py-2.5 rounded-lg text-white/40 text-xs items-center flex gap-x-2 shadow-sm hover:text-white/60 focus:ring-gray-800"
          onClick={() => setShowMetaInputs(!showMetaInputs)}
        >
          {showMetaInputs ? (
            <>
              {" "}
              <EyeClosed className="w-4 h-4" /> Hide{" "}
            </>
          ) : (
            <>
              {" "}
              <Eye className="w-4 h-4" /> Show{" "}
            </>
          )} Inputs
        </Button>
      )}
      {showMetaInputs && (
        <div className="w-full md:w-[700px]">
          {workspace?.metaResponse && inputs != undefined && (
            <div className="w-full backdrop-blur-sm absolute -bottom-10 md:-bottom-8 left-0 z-10 md:z-0 flex justify-center items-center gap-6">
              <Button
                type="button"
                className="text-right mb-2 md:mb-0 transition-all w-fit duration-300 px-5 py-2.5 rounded-lg text-white/40 text-xs items-center flex gap-x-2 shadow-sm hover:text-white/60 focus:ring-gray-800"
                onClick={() => setShowMetaInputs(!showMetaInputs)}
              >
                {showMetaInputs ? (
                  <>
                    {" "}
                    <EyeClosed className="w-4 h-4" /> Hide{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <Eye className="w-4 h-4" /> Show{" "}
                  </>
                )}{" "}
                {shouldShowMetaInputs
                  ? inputs?.settings?.displayType
                  : "text input"}
              </Button>
              <Button
                type="button"
                className="mb-2 md:mb-0 transition-all w-fit duration-300 px-5 py-2.5 rounded-lg text-white/40 text-xs items-center flex gap-x-2 shadow-sm hover:text-white/60 focus:ring-gray-800"
                onClick={() => setIsForcedTextInput(!isForcedTextInput)}
              >
                {isForcedTextInput ? (
                  <>
                    <Cursor className="h-4 w-4" /> Use{" "}
                    {inputs?.settings?.displayType}
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
      )}
    </div>
  );
};

export default MetaInputs;
