export function dateStringToFormattedTimeString(date: Date): string;
export function dateStringToFormattedTimeString(dateString: string): string;
export function dateStringToFormattedTimeString(dateString: string | Date): string {
  let date: Date = undefined;
  if (typeof dateString === "string") {
    try {
      date = new Date(dateString);
    } catch {
      return "";
    }
  } else {
    date = dateString;
  }
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}