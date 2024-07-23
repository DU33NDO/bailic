import React from "react";
import ImageTextSlider from "@/components/ImageSlider";

interface ModalShowRulesProps {
  onClose: () => void;
}

const ModalShowRules: React.FC<ModalShowRulesProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full bg-[#0000009E] flex justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute text-3xl top-2 right-8 text-black rounded-full p-2"
        >
          &#10005; {/* Close button */}
        </button>
        <ImageTextSlider />
      </div>
    </div>
  );
};

export default ModalShowRules;
