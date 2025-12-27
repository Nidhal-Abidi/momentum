const CALENDAR_VIEW_COOKIE = "calendar-view";
const ONE_YEAR = 365 * 24 * 60 * 60; // seconds

export type CalendarView = "grid" | "single";

/**
 * Get the calendar view preference from cookies (client-side)
 * @returns "grid" or "single", defaults to "grid"
 */
export function getCalendarViewClient(): CalendarView {
  if (typeof window === "undefined") return "grid";

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CALENDAR_VIEW_COOKIE}=`))
    ?.split("=")[1];

  return (value === "single" ? "single" : "grid") as CalendarView;
}

/**
 * Set the calendar view preference in cookies (client-side)
 * @param view - "grid" or "single"
 */
export function setCalendarViewClient(view: CalendarView): void {
  if (typeof window === "undefined") return;

  const maxAge = ONE_YEAR;
  document.cookie = `${CALENDAR_VIEW_COOKIE}=${view}; path=/; max-age=${maxAge}; samesite=lax`;
}
