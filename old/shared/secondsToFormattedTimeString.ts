export function secondsToFormattedTimeString(inputSeconds: number): string {
  const hours = Math.floor(inputSeconds / 3600);
  const minutes = Math.floor((inputSeconds % 3600) / 60);
  const seconds = inputSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}