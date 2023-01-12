import { ISportMatchSet } from "../interfaces/database";

export function getWinnerTeamNumber(sportMatchSets: ISportMatchSet[]): number[] {
  let winnerList: number[] = [];
  for (const sportMatchSet of sportMatchSets.sort((a, b) => a.setNumber > b.setNumber ? 1 : -1)) {
    const setWinner = sportMatchSet.sportScore.reduce((a, b) => a.score > b.score ? a : b).teamNumber;
    while (winnerList.length <= setWinner) {
      winnerList.push(0);
    }
    winnerList[setWinner] += 1;
  }
  return winnerList;
}