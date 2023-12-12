export enum SportEventVisibility {
  creatorOnly,
  creatorMembers,
  creatorMemberClubSportMember,
  creatorMemberClubMember,
  public,
}

export function getSportEventVisibilityText(visibility: SportEventVisibility): string {
  switch (visibility) {
    case SportEventVisibility.creatorOnly:
      return "Creator (private)";
    case SportEventVisibility.creatorMembers:
      return "Creator + Member";
    case SportEventVisibility.creatorMemberClubSportMember:
      return "Creator + Member + Sport Member (Club)";
    case SportEventVisibility.creatorMemberClubMember:
      return "Creator + Member + Club Member";
    case SportEventVisibility.public:
      return "Everyone (Public)";
    default:
      return 'Unknown';
  }
}
// TODO: Add icons for all visibility types
export function getSportEventVisibilityIconName(visibility: SportEventVisibility): string {
  switch (visibility) {
    case SportEventVisibility.creatorOnly:
      return "lock";
    case SportEventVisibility.creatorMembers:
      return "lock-open";
    case SportEventVisibility.creatorMemberClubSportMember:
      return "lock-open";
    case SportEventVisibility.creatorMemberClubMember:
      return "lock-open";
    case SportEventVisibility.public:
      return "earth";
    default:
      return 'help';
  }
}