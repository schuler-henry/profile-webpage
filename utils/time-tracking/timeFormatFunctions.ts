export function getTimeStringFromMinutes(totalTimeInMinutes: number): string {
  return (
    `${Math.floor(totalTimeInMinutes / 60)}h` +
    ` ${Math.round(totalTimeInMinutes % 60)
      .toString()
      .padStart(2, '0')}min`
  );
}

export function getTimeStringFromSeconds(totalTimeInSeconds: number): string {
  return (
    `${Math.floor(totalTimeInSeconds / 60 / 60)}h` +
    ` ${Math.floor((totalTimeInSeconds / 60) % 60)
      .toString()
      .padStart(2, '0')}min` +
    ` ${Math.round(totalTimeInSeconds % 60)
      .toString()
      .padStart(2, '0')}s`
  );
}