import React from "react";
// import TextInput from './TextInput';
import OptionSelect from "@/components/WorkspaceChat/ChatContainer/DynamicInput/OptionSelect";
import { ArrowUUpLeft, Keyboard } from "@phosphor-icons/react";
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
  isForcedTextInput,
  setIsForcedTextInput,
}) => {
  const InputComponent = inputComponents[inputs?.type] || null;
  if (!InputComponent) {
    return null; // or any fallback UI
  }
  return (
    <div className="w-full px-4 fixed md:absolute bottom-10 left-0 z-10 md:z-0 flex justify-center items-center">
      <div className="w-[600px]">
        <InputComponent {...inputs} />
        {isDynamicInput && inputs != undefined && (
          <div className="flex justify-end">
            <button
              type="button"
              className="pb-5  transition-all w-fit duration-300   px-5 py-2.5 rounded-lg text-white/50 text-xs items-center flex gap-x-2  hover:text-white focus:ring-gray-800"
              onClick={() => setIsForcedTextInput(!isForcedTextInput)}
            >
              {isForcedTextInput ? (
                <>
                  <ArrowUUpLeft className="h-5 w-5" /> back to options
                </>
              ) : (
                <>
                  <Keyboard className="h-5 w-5" /> Type another answer
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
