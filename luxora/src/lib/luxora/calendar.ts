import { dateStrInTimeZone } from "@/lib/luxora/timezone";

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Monday-start week containing dateStr, as 7 YYYY-MM-DD strings. */
export function getWeekDates(dateStr: string): string[] {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dow = date.getUTCDay(); // 0 = Sunday
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = addDays(dateStr, mondayOffset);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/**
 * "Today" as the business's own clock sees it, not UTC — a business west
 * of UTC can still be "yesterday" locally after UTC has already ticked
 * over, which used to point the calendar's default view, "Today" button,
 * and month/day highlighting at the wrong day (and, right at a month or
 * year boundary, the wrong month or year).
 */
export function todayDateStr(timeZone: string): string {
  return dateStrInTimeZone(new Date(), timeZone);
}

export function weekdayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}

export function dayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Monday-start weeks covering the full calendar month containing dateStr. */
export function getMonthGrid(dateStr: string): string[][] {
  const [y, m] = dateStr.split("-").map(Number);
  const firstOfMonth = `${y}-${String(m).padStart(2, "0")}-01`;
  const firstWeek = getWeekDates(firstOfMonth);
  const lastDayOfMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lastOfMonth = `${y}-${String(m).padStart(2, "0")}-${String(lastDayOfMonth).padStart(2, "0")}`;
  const lastWeek = getWeekDates(lastOfMonth);

  const weeks: string[][] = [];
  let cursor = firstWeek[0];
  const end = lastWeek[6];
  while (cursor <= end) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(cursor, i)));
    cursor = addDays(cursor, 7);
  }
  return weeks;
}
