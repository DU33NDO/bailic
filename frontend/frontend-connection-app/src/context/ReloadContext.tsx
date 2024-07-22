"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ReloadContextProps {
  children: React.ReactNode;
}

const ReloadContext = createContext<null | undefined>(undefined);

export const ReloadProvider: React.FC<ReloadContextProps> = ({ children }) => {
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message = "Вы уверены, что хотите перезагрузить страницу?";
      event.preventDefault();
      event.returnValue = message; // Для некоторых браузеров необходимо устанавливать returnValue
      return message;
    };

    const handleUnload = (event: BeforeUnloadEvent) => {
      const confirmReload = window.confirm(
        "Вы уверены, что хотите перезагрузить страницу?"
      );
      if (confirmReload) {
        setShouldRedirect(true);
      } else {
        event.preventDefault();
        event.returnValue = ""; // Для некоторых браузеров необходимо устанавливать returnValue
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("http://localhost:3000");
    }
  }, [shouldRedirect, router]);

  return (
    <ReloadContext.Provider value={null}>{children}</ReloadContext.Provider>
  );
};

export const useReloadContext = () => {
  return useContext(ReloadContext);
};
