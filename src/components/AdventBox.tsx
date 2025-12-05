import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import ImageLightbox from "./ImageLightbox";
import { useAuth } from "@/contexts/AuthContext";
import { getImageOfDay, openCalendarDay } from "@/lib/api";

interface AdventBoxProps {
    day: number;
    style: React.CSSProperties;
    isDbOpen: boolean;
    canOpen: boolean;
    onOpen: () => void;
}

const AdventBox = ({ day, style, isDbOpen, canOpen, onOpen }: AdventBoxProps) => {
    const { user } = useAuth();
    const [isRequestProcessing, setIsRequestProcessing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);
    const [iseLightboxOpen, setIsLightboxOpen] = useState(false);

    const openMutation = useMutation({
        mutationFn: () => openCalendarDay(user!.token, day),
        onSuccess: () => {
            setIsRevealing(true);

            setTimeout(() => {
                setIsOpen(true);
                onOpen();
            }, 300);

            setTimeout(() => {
                setIsRequestProcessing(false);
                setIsRevealing(false);
            }, 1500);
        },
    });

    const { data: imgBlob, isSuccess: isImgQuerySuccess } = useQuery({
        queryKey: [`my-calendar_img_${user?.name}_${day}`, user?.token],
        queryFn: async () => {
            if (!user) throw new Error("No user");

            return getImageOfDay(user.token, day);
        },
        enabled: (isOpen || isDbOpen) && !!user,
    });

    useEffect(() => {
        if (isDbOpen) setIsOpen(true);
    }, [isDbOpen]);

    const handleClick = () => {
        if (isOpen) {
            setIsLightboxOpen(true);
            return;
        }

        if (canOpen && !isRequestProcessing) {
            setIsRequestProcessing(true);
            openMutation.mutate();
        }
    };

    return (
        <>
            {/* Full screen reveal overlay */}
            {isRevealing && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    <div className="absolute inset-0 bg-christmas-gold/20 animate-pulse-glow" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl md:text-8xl animate-bounce-in">✨</div>
                    </div>
                </div>
            )}

            <ImageLightbox
                imageUrl={isImgQuerySuccess ? URL.createObjectURL(imgBlob) : "placeholderimg"}
                alt={`Day ${day} surprise`}
                isOpen={iseLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
            />

            <div
                className={`advent-box absolute w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 ${isOpen ? "open cursor-pointer" : ""} ${!canOpen && !isOpen ? "locked" : ""}`}
                style={style}
                onClick={handleClick}
            >
                <div className="advent-box-container">
                    {/* Content behind the door */}
                    <div className="advent-box-content">
                        <img
                            src={
                                isImgQuerySuccess ? URL.createObjectURL(imgBlob) : "placeholderimg"
                            }
                            alt={`Day ${day} surprise`}
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>

                    {/* Door that opens */}
                    <div className="advent-box-door">
                        <div className="ribbon ribbon-v" />
                        <div className="ribbon ribbon-h" />
                        <div className="bow flex items-center justify-center">
                            <span className="text-sm sm:text-base md:text-2xl lg:text-3xl font-bold text-christmas-red">
                                {day}
                            </span>
                        </div>
                        {!canOpen && !isOpen && (
                            <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center">
                                <span className="text-lg">🔒</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdventBox;
