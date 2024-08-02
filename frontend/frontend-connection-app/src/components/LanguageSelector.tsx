import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isOpen,
  onClose,
}) => {
  const [locale, setLocale] = useLanguage();

  const languages = [
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
    { code: "kz", label: "KZ" },
  ];

  const handleLanguageChange = (langCode: string) => {
    setLocale({ language: langCode });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 bg-black shadow-lg rounded-lg overflow-hidden z-10">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`block w-full px-4 py-2 md:px-10 md:py-6 text-left hover:bg-[#477370] ${
            locale.language === lang.code ? "bg-[#BA3B3A]" : ""
          }`}
          onClick={() => handleLanguageChange(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
