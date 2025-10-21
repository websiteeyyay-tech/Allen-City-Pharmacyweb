import React from "react";
import { FaTimes } from "react-icons/fa";

interface PromoBarProps {
    visible: boolean;
    onClose: () => void;
    message?: string;
}

const PromoBar: React.FC<PromoBarProps> = ({
    visible,
    onClose,
    message = "🎉 Free Delivery on orders over ₱1000! Limited time only!",
}) => {
    if (!visible) return null;

    return (
        <div
            className="w-full text-white text-sm flex items-center justify-between px-4 py-2"
            style={{ background: "linear-gradient(90deg,#f97316,#16a34a)" }} // orange -> green
        >
            <span className="font-medium">{message}</span>
            <button
                onClick={onClose}
                aria-label="Close Promotion Bar"
                className="ml-4 p-1 hover:opacity-80"
            >
                <FaTimes />
            </button>
        </div>
    );
};

export default PromoBar;