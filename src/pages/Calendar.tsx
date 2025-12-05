import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Snowfall from "@/components/Snowfall";
import AdventBox from "@/components/AdventBox";
import { getMyCalendar, me } from "@/lib/api";
import { toast } from "sonner";

// Fixed positions for each box (percentage-based, carefully spaced to avoid overlap)
const boxPositions = [
    { top: "45%", left: "33%" },
    { top: "5%", left: "48%" },
    { top: "65%", left: "83%" },
    { top: "45%", left: "63%" },
    { top: "25%", left: "8%" },
    { top: "65%", left: "23%" },
    { top: "65%", left: "38%" },
    { top: "25%", left: "53%" },
    { top: "5%", left: "63%" },
    { top: "5%", left: "3%" },
    { top: "45%", left: "48%" },
    { top: "5%", left: "18%" },
    { top: "25%", left: "83%" },
    { top: "45%", left: "78%" },
    { top: "65%", left: "8%" },
    { top: "5%", left: "33%" },
    { top: "45%", left: "3%" },
    { top: "25%", left: "23%" },
    { top: "65%", left: "68%" },
    { top: "25%", left: "38%" },
    { top: "5%", left: "78%" },
    { top: "25%", left: "68%" },
    { top: "45%", left: "18%" },
    { top: "65%", left: "53%" },
];

const checkDay = (day: number): boolean => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(2025, 11, day);
    target.setHours(0, 0, 0, 0);

    return target <= now;
};

const Calendar = () => {
    const { user, isLoading: authLoading, logout } = useAuth();
    const [remaining, setRemaining] = useState(0);
    const navigate = useNavigate();

    const { data, isSuccess } = useQuery({
        queryKey: ["my-calendar", user?.token],
        queryFn: async () => {
            if (!user) throw new Error("No user");

            return getMyCalendar(user.token);
        },
        enabled: !!user,
    });

    // This checks token expiration on every page load
    useEffect(() => {
        const checkTokenExpiration = async () => {
            try {
                await me(user.token);
            } catch (error) {
                toast.error("Your token has expired, please log in again");
                logout();
            }
        };

        if (user) checkTokenExpiration();
    }, [user]);

    useEffect(() => {
        if (isSuccess) {
            setRemaining(
                data.days.filter((calendarDay) => !calendarDay.is_open && checkDay(calendarDay.day))
                    .length,
            );
        }
    }, [data]);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
        }
    }, [user, navigate, authLoading]);

    if (!user) return null;

    return (
        <div className="h-screen relative overflow-hidden flex flex-col">
            <Snowfall />
            <Navbar />

            {/* Header */}
            <div className="font-christmasCasual relative z-10 pt-20 pb-2 text-center flex-shrink-0">
                <h1 className="font-christmas text-3xl md:text-5xl p-2 font-bold text-gradient-gold">
                    Your Advent Calendar
                </h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                    {remaining > 0 ? (
                        <>
                            You can open{" "}
                            <span className="font-christmas text-2xl text-christmas-gold font-semibold">
                                {remaining}
                            </span>{" "}
                            more box{remaining !== 1 ? "es" : ""} today, {user.name}! 🎁
                        </>
                    ) : (
                        <>Come back tomorrow for more surprises, {user.name}! 🌟</>
                    )}
                </p>
            </div>

            {/* Calendar Grid */}
            <div className="font-christmas text-3xl text-center relative z-10 flex-1 w-full px-2 sm:px-4 md:px-8">
                {Array.from({ length: 24 }, (_, i) => i + 1).map((day) => (
                    <AdventBox
                        key={day}
                        day={day}
                        style={boxPositions[day - 1]}
                        isDbOpen={isSuccess && data.days[day - 1].is_open}
                        canOpen={checkDay(day)}
                        onOpen={() => setRemaining((prev) => prev - 1)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Calendar;
