import { Globe } from "@phosphor-icons/react";
import { useLanguageOptions } from "@/hooks/useLanguageOptions";
import { useState, useRef, useEffect } from "react";

export default function LanguageSelector() {
    const {
        currentLanguage,
        supportedLanguages,
        getLanguageName,
        changeLanguage,
    } = useLanguageOptions();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen]);

    const handleLanguageChange = (lang) => {
        changeLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="transition-all duration-300 p-2 rounded-full bg-theme-sidebar-footer-icon hover:bg-theme-sidebar-footer-icon-hover"
                aria-label="Select Language"
                data-tooltip-id="footer-item"
                data-tooltip-content="Change Language"
            >
                <Globe
                    weight="fill"
                    className="h-5 w-5"
                    color="var(--theme-sidebar-footer-icon-fill)"
                />
            </button>

            {isOpen && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-theme-bg-secondary border border-theme-modal-border rounded-lg shadow-lg overflow-hidden z-50 min-w-[160px]">
                    <div className="max-h-[300px] overflow-y-auto">
                        {supportedLanguages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentLanguage === lang
                                        ? "bg-theme-sidebar-footer-icon text-white font-semibold"
                                        : "text-theme-text-primary hover:bg-theme-sidebar-footer-icon-hover"
                                    }`}
                            >
                                {getLanguageName(lang)}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
