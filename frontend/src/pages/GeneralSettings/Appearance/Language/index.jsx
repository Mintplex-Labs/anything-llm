import { useState } from "react"; 
import { useTranslation } from "react-i18next";

export default function Language() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('en'); 

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    console.log("Selected language: " + event.target.value);
    i18n.changeLanguage(event.target.value);
  }; 

  return (
    <div className="mt-6 mb-8">

      <div className="flex flex-col gap-y-1">
        <h2 className="text-base leading-6 font-bold text-white">
          Select Language
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60">
          Select your display language.
        </p>
      </div>
      <div>
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select> 
      </div>

    </div>
  );
}
