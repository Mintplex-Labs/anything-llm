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
  //   text: TextInput,
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
    if (inputs?.type !== "text") {
      setIsForcedTextInput(false);
    }
  }, [inputs]);

  const InputComponent = inputComponents[inputs?.type] || null;
  if (!InputComponent) {
    return null; // or any fallback UI
  }
  const renderPromptInput = () => {
    if (inputs?.type === "text" || inputs === undefined || isForcedTextInput) {
      return (
        <PromptInput
          className={
            inputs !== undefined ? "bottom-8 md:-bottom-5" : "-bottom-2"
          }
          workspace={workspace}
          message={message}
          submit={submit}
          onChange={onChange}
          inputDisabled={inputDisabled}
          buttonDisabled={buttonDisabled}
          sendCommand={sendCommand}
        />
      );
    }
  };
  return (
    <div className="w-full md:px-4 fixed md:absolute bottom-10 left-0 z-10 md:z-0 flex justify-center items-center">
      <div className="w-[600px]">
        {inputs?.type !== "text" &&
        isDynamicInput &&
        inputs !== undefined &&
        !isForcedTextInput ? (
          <InputComponent
            submit={submit}
            setMessage={setMessage}
            message={message}
            {...inputs}
          />
        ) : (
          renderPromptInput()
        )}
        {isDynamicInput && inputs != undefined && (
          <div className="w-full fixed absolute -bottom-8 left-0 z-10 md:z-0 flex justify-center items-center">
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
