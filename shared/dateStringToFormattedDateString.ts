export function dateStringToFormattedDateString(date: Date): string;
export function dateStringToFormattedDateString(dateString: string): string;
export function dateStringToFormattedDateString(dateString: string | Date): string {
  let date: Date = undefined;
  if (dateString === undefined) return "";
  if (typeof dateString === "string") {
    try {
      date = new Date(dateString);
    } catch {
      return "";
    }
  } else {
    date = dateString;
  }

  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
}