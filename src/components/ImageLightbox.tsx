import { useEffect, useState } from "react";

interface ImageLightboxProps {
    imageUrl: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

const ImageLightbox = ({ imageUrl, alt, isOpen, onClose }: ImageLightboxProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-200 ${
                isVisible ? "bg-black/70" : "bg-black/0"
            }`}
            onClick={handleBackdropClick}
        >
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                aria-label="Close lightbox"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <img
                src={imageUrl}
                alt={alt}
                className={`max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-all duration-200 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
};

export default ImageLightbox;
