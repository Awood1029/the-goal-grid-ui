import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Converts a UTC date string or Date object to the user's local time
 * @param date UTC date string or Date object
 * @returns Date object in local time
 */
export function utcToLocal(date: string | Date): Date {
	const utcDate = typeof date === "string" ? new Date(date) : date;
	return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
}

/**
 * Gets the current hour in the user's local timezone (0-23)
 * @returns number representing the current hour
 */
export function getCurrentLocalHour(): number {
	return new Date().getHours();
}

/**
 * Formats a UTC date to a localized string based on user's timezone
 * @param date UTC date string or Date object
 * @param formatStr Optional date-fns format string
 * @returns formatted date string
 */
export function formatLocalDateTime(
	date: string | Date,
	formatStr: string = "PPp"
): string {
	const localDate = utcToLocal(date);
	return format(localDate, formatStr);
}

/**
 * Formats a UTC date as a relative time string (e.g., "2 hours ago")
 * @param date UTC date string or Date object
 * @returns relative time string
 */
export function formatRelativeTime(date: string | Date): string {
	const localDate = utcToLocal(date);
	return formatDistanceToNow(localDate, { addSuffix: true });
}
