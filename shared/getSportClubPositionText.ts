export function getSportClubPositionText(position: number): string {
  switch (position) {
    case 0:
      return "Member";
    case 1:
      return "Trainer";
    default:
      return "unavailable";
  }
}