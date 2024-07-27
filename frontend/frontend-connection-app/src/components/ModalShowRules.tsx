import React, { useState, useEffect } from "react";
import ImageTextSlider from "@/components/ImageSlider";

interface ModalShowRulesProps {
  onClose: () => void;
}

const ModalShowRules: React.FC<ModalShowRulesProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full h-full bg-[#0000009E] flex justify-center transform transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute text-3xl top-2 right-8 text-black rounded-full p-2"
        >
          &#10005;
        </button>
        <ImageTextSlider />
      </div>
    </div>
  );
};

export default ModalShowRules;
