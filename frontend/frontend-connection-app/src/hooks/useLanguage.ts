import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Language = "en" | "ru" | "kz";

const languageAtom = atomWithStorage<{
  language: any;
}>("language", {
  language: "en",
});

export function useLanguage() {
  return useAtom(languageAtom);
}
