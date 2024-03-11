import React, { useEffect, useState } from "react";
// import TextInput from './TextInput';
import OptionSelect from "@/components/WorkspaceChat/ChatContainer/DynamicInput/OptionSelect";
import { Cursor, Keyboard } from "@phosphor-icons/react";
import PromptInput from "../PromptInput";
// import RangeSlider from './RangeSlider';
// import DatePicker from './DatePicker';
// import TimePicker from './TimePicker';
// import DateTimePicker from './DateTimePicker';
// import FileUpload from './FileUpload';
// import Rating from './Rating';
// import Checkbox from './Checkbox';

const inputComponents = {
  text: PromptInput,
  options: OptionSelect,
  //   range: RangeSlider,
  //   date: DatePicker,
  //   time: TimePicker,
  //   datetime: DateTimePicker,
  //   file: FileUpload,
  //   rating: Rating,
  //   checkbox: Checkbox
};

const DynamicInput = ({
  inputs,
  isDynamicInput,
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

  useEffect(() => {
    setIsForcedTextInput(inputs?.type === "text");
  }, [inputs]);

  // Select the appropriate input component based on inputs.type or force text input
  const InputComponent =
    inputs && (isForcedTextInput || inputs.type === "text")
      ? inputComponents["text"]
      : inputComponents[inputs?.type] || null;

  // Condition to show the dynamic input or the forced text input
  const shouldShowDynamicInput =
    isDynamicInput && inputs !== undefined && !isForcedTextInput;

  return (
    <div className="w-full md:px-4 fixed md:absolute bottom-10 left-0 z-10 md:z-0 flex justify-center items-center">
      <div className="w-[600px]">
        {shouldShowDynamicInput ? (
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
        {isDynamicInput && inputs != undefined && (
          <div className="w-full  absolute -bottom-8 left-0 z-10 md:z-0 flex justify-center items-center">
            <button
              type="button"
              className="transition-all w-fit duration-300 px-5 py-2.5 rounded-lg text-white/40 text-xs items-center flex gap-x-2 shadow-sm hover:text-white/60 focus:ring-gray-800"
              onClick={() => setIsForcedTextInput(!isForcedTextInput)}
            >
              {isForcedTextInput ? (
                <>
                  <Cursor className="h-5 w-5" /> Select an option
                </>
              ) : (
                <>
                  <Keyboard className="h-5 w-5" /> Type a response
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicInput;
