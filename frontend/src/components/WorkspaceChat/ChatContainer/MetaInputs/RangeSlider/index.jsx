import Label from "@/components/Generic/Typography/Label";
import { useState, useMemo, useRef } from "react";
import { PaperPlaneRight } from "@phosphor-icons/react";
import Button from "@/components/Generic/Buttons/Button";

const RangeSlider = ({
  data,
  settings,
  message,
  setMessage,
  onSubmit,
  submit,
  workspace,
}) => {
  const [value, setValue] = useState((data.min + data.max) / 2);
  const [hasInteracted, setHasInteracted] = useState(false);

  const mounted = useRef(null);

  const handleChange = (event) => {
    setValue(event.target.value);
    setHasInteracted(true);
    if (settings.showValue) {
      setMessage(`Selected value: ${event.target.value}`);
    }
  };

  const handleSubmit = () => {
    submit();
  };

  // Calculate steps and generate markers
  const markers = useMemo(() => {
    const totalSteps = (data.max - data.min) / data.step;
    const markerPositions = [];
    for (let i = 0; i <= totalSteps; i++) {
      const position = (i / totalSteps) * 97.5;
      markerPositions.push(position);
    }
    return markerPositions;
  }, [data.min, data.max, data.step]);

  return (
    <div
      ref={mounted}
      className=" text-white/70 text-sm w-full backdrop-blur-sm rounded-t-xl overflow-hidden px-6 py-8 border-l border-t border-r border-[#2f3238]"
    >
      <div className="flex flex-row justify-between">
        <Label
          label={data.label || "Select a Number"}
          description={data.description || "Chose a Number to continue"}
        />
        <p className="range-slider-value flex items-center text-5xl text-white rounded-full px-5 py-2 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]  ">
          {value}
        </p>
      </div>
      <div className="relative w-full mt-10">
        <input
          type="range"
          id="range-slider"
          min={data.min}
          max={data.max}
          step={data.step}
          value={value}
          onChange={handleChange}
          className="range-slider block py-2.5 border-b border-white/10 last:border-0 hover:bg-sidebar/50 cursor-pointer w-full bg-sky-200 "
        />
        <div className="absolute top-0 mx-1.5 w-full flex justify-between">
          {markers.map((position, index) => (
            <div
              key={index}
              style={{ left: `${position}%` }}
              className="absolute bottom-0 h-3 w-0.5 bg-white/20"
            ></div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center relative ">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Min ({data.min})
        </span>
        {!hasInteracted && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Max ({data.max})
          </span>
        )}
        {hasInteracted && (
          <div className="absolute -bottom-2 right-0">
            <Button
              onClick={handleSubmit}
              label="Submit"
              icon={PaperPlaneRight}
              iconRight
              text={"submit"}
              textClass="text-white/60"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RangeSlider;
