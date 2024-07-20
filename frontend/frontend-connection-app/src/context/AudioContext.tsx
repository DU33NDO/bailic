"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AudioContextProps {
  isPlaying: boolean;
  toggleAudio: () => void;
  setAudioSource: (source: string) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSourceState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audioRef.current.addEventListener("play", handlePlay);
      audioRef.current.addEventListener("pause", handlePause);
      audioRef.current.addEventListener("canplaythrough", () => {
        if (audioRef.current && isPlaying) {
          audioRef.current.play().catch((error) => {
            console.error("Audio play failed:", error);
          });
        }
      });

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("play", handlePlay);
          audioRef.current.removeEventListener("pause", handlePause);
          audioRef.current.removeEventListener("canplaythrough", () => {});
        }
      };
    }
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch((error) => {
          console.error("Audio play failed:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  const setAudioSource = (source: string) => {
    if (audioRef.current && audioSource !== source) {
      audioRef.current.src = source;
      audioRef.current.load();
      setAudioSourceState(source);
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Audio play failed:", error);
        });
      }
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, setAudioSource }}>
      {children}
    </AudioContext.Provider>
  );
};
