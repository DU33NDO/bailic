"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type Language = "en" | "ru" | "kz";

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: { [key: string]: string };
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const loadTranslations = async () => {
      const response = await fetch(`/locales/${language}.json`);
      const data = await response.json();
      setTranslations(data);
    };

    loadTranslations();
  }, [language]);

  const value = {
    language,
    setLanguage,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
