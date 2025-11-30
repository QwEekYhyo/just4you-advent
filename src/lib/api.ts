export const BACKEND_URL = "http://localhost:5000";

export type CalendarDay = {
    day: number;
    is_open: boolean;
};

export type Calendar = {
    id: number;
    name: string;
    days: CalendarDay[];
};

export async function getMyCalendar(token: string): Promise<Calendar> {
    const response = await fetch(BACKEND_URL + "/my-calendar", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok)
        throw new Error("Error while fetching your calendar");

    return response.json();
}
