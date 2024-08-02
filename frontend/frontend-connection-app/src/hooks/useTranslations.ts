import enTranslations from "../../public/locales/en.json";
import ruTranslations from "../../public/locales/ru.json";
import kzTranslations from "../../public/locales/kz.json";

const dictionaries = {
  en: enTranslations,
  ru: ruTranslations,
  kz: kzTranslations,
};

export function useTranslations(locale: "en" | "ru" | "kz") {
  return dictionaries[locale];
}
