import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { IUser } from "../../../interfaces/database";

type Data = {
  users: IUser[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all users without sport sportclub membership (valid token required)
 * @category API
 */
async function getSportClubsHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const sportClubId: number = req.body.sportClubId;
  const sportId: number = req.body.sportId;
  
  const users: IUser[] = await BACK_END_CONTROLLER.handleGetUsersWithoutSportClubMembershipSport(userToken, sportClubId, sportId);

  res.status(200).json({ users: users })
}

export default getSportClubsHandler;