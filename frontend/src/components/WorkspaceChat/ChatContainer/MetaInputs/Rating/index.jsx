import React, { useEffect, useState } from "react";
import { PaperPlaneRight, Star } from "@phosphor-icons/react";

import Label from "@/components/Generic/Typography/Label";
import Button from "@/components/Generic/Buttons/Button";

const StarRating = ({ data, submit, setMessage, message }) => {
  const [rating, setRating] = useState(data.defaultValue || 0);
  const [hoveredRating, setHoveredRating] = useState(undefined);
  const [submitRating, setSubmitRating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (submitRating) {
      setIsSubmitting(true);
      submit();
      setSubmitRating(false);
    }
  }, [rating]);

  const handleRating = (rate) => {
    setRating(rate);
    setMessage(`Selected rating: ${rate} stars of ${data.max} stars`);
    setSubmitRating(true);
  };

  return (
    <div className=" text-white/70 text-sm w-full backdrop-blur-sm rounded-t-xl overflow-hidden px-6 py-8 border-l border-t border-r border-[#2f3238]">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <Label
          label={data.label || "Please Rate the above experiance"}
          description={data.description || "Your feedback helps us improve."}
        />
        <div className="mx-auto mt-6 md:mx-0 flex items-center gap-2">
          {[...Array(data.max)].map((_, index) => (
            <button
              key={index}
              onMouseEnter={() => setHoveredRating(index + 1)}
              onMouseLeave={() => setHoveredRating(undefined)}
              onClick={() => handleRating(index + 1)}
              className="mx-1"
              disabled={isSubmitting}
            >
              {rating > index || hoveredRating > index ? (
                <Star size={34} color="#ffd700" weight="fill" fill="#ffd700" />
              ) : (
                <Star size={34} color="#ffd700" />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* <div className="flex justify-end items-center mt-4">
        <Button
          onClick={handleSubmit}
          label="Submit"
          icon={PaperPlaneRight}
          iconRight
          text={'Submit'}
          textClass="text-white/60"
        />
      </div> */}
    </div>
  );
};

export default StarRating;
