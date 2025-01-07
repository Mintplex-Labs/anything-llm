import { useState, useRef, useEffect } from "react";
import { TextT } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function TextSizeButton() {
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  const buttonRef = useRef(null);

  return (
    <>
      <div
        ref={buttonRef}
        id="text-size-btn"
        data-tooltip-id="tooltip-text-size-btn"
        data-tooltip-content="Change text size"
        aria-label="Change text size"
        onClick={() => setShowTextSizeMenu(!showTextSizeMenu)}
        className={`border-none relative flex justify-center items-center opacity-60 hover:opacity-100 light:opacity-100 light:hover:opacity-60 cursor-pointer ${
          showTextSizeMenu ? "!opacity-100" : ""
        }`}
      >
        <TextT
          color="var(--theme-sidebar-footer-icon-fill)"
          weight="fill"
          className="w-[22px] h-[22px] pointer-events-none text-white"
        />
        <Tooltip
          id="tooltip-text-size-btn"
          place="top"
          delayShow={300}
          className="tooltip !text-xs z-99"
        />
      </div>
      <TextSizeMenu
        showing={showTextSizeMenu}
        setShowing={setShowTextSizeMenu}
        buttonRef={buttonRef}
      />
    </>
  );
}

function TextSizeMenu({ showing, setShowing, buttonRef }) {
  const formRef = useRef(null);
  const [selectedSize, setSelectedSize] = useState(
    window.localStorage.getItem("anythingllm_text_size") || "normal"
  );

  useEffect(() => {
    function listenForOutsideClick() {
      if (!showing || !formRef.current) return false;
      document.addEventListener("click", closeIfOutside);
    }
    listenForOutsideClick();
  }, [showing, formRef.current]);

  const closeIfOutside = ({ target }) => {
    if (target.id === "text-size-btn") return;
    const isOutside = !formRef?.current?.contains(target);
    if (!isOutside) return;
    setShowing(false);
  };

  const handleTextSizeChange = (size) => {
    setSelectedSize(size);
    window.localStorage.setItem("anythingllm_text_size", size);
    window.dispatchEvent(new CustomEvent("textSizeChange", { detail: size }));
  };

  if (!buttonRef.current) return null;

  return (
    <div hidden={!showing}>
      <div
        ref={formRef}
        className="absolute bottom-16 -ml-8 w-[140px] p-2 bg-theme-action-menu-bg rounded-lg shadow-md flex flex-col justify-center items-start gap-2 z-50"
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowing(false);
            handleTextSizeChange("small");
          }}
          className={`border-none w-full hover:cursor-pointer px-2 py-1 rounded-md flex flex-col justify-start group ${
            selectedSize === "small"
              ? "bg-theme-action-menu-item-hover"
              : "hover:bg-theme-action-menu-item-hover"
          }`}
        >
          <div className="w-full flex-col text-left flex pointer-events-none">
            <div className="text-theme-text-primary text-xs">Small</div>
          </div>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            setShowing(false);
            handleTextSizeChange("normal");
          }}
          className={`border-none w-full hover:cursor-pointer px-2 py-1 rounded-md flex flex-col justify-start group ${
            selectedSize === "normal"
              ? "bg-theme-action-menu-item-hover"
              : "hover:bg-theme-action-menu-item-hover"
          }`}
        >
          <div className="w-full flex-col text-left flex pointer-events-none">
            <div className="text-theme-text-primary text-sm">Normal</div>
          </div>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            setShowing(false);
            handleTextSizeChange("large");
          }}
          className={`border-none w-full hover:cursor-pointer px-2 py-1 rounded-md flex flex-col justify-start group ${
            selectedSize === "large"
              ? "bg-theme-action-menu-item-hover"
              : "hover:bg-theme-action-menu-item-hover"
          }`}
        >
          <div className="w-full flex-col text-left flex pointer-events-none">
            <div className="text-theme-text-primary text-[16px]">Large</div>
          </div>
        </button>
      </div>
    </div>
  );
}
