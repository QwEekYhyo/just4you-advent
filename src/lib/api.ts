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
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error("Error while fetching your calendar");

    return response.json();
}

export async function openCalendarDay(token: string, day: number): Promise<boolean> {
    const response = await fetch(BACKEND_URL + "/my-calendar/open/" + day, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        switch (response.status) {
            case 400:
                throw new Error("Day must be between 1 and 24");
            case 404:
                // This should never happen
                throw new Error("User deleted or day not in calendar");
            case 409:
                throw new Error(`Day ${day} already opened`);
            default:
                throw new Error("Unknown error while opening calendar day");
        }
    }

    return response.ok;
}
