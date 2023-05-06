import { ISportEvent } from "../interfaces/database";

/**
 * Compares two sport events
 * @param a 
 * @param b 
 * @returns true if sport event a and b are equal, false otherwise
 */
export function compareSportEvents(a: ISportEvent, b: ISportEvent): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}