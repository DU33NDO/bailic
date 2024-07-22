import React from "react";

interface CustomModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded">
        <p>Are you sure you want to refresh the page?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onCancel}
            className="mr-2 px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
