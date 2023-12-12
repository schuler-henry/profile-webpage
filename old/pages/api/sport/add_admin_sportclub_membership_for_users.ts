import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { IUser } from "../../../interfaces/database";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to add a multiple users to a sport club sport (sport club admin)
 * @category API
 */
async function addAdminSportClubMembershipHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const sportClubId: number = req.body.sportClubId;
  const sportId: number = req.body.sportId;
  const users: IUser[] = req.body.users;

  const success: boolean = await BACK_END_CONTROLLER.handleAddAdminUserSportClubMembership(userToken, sportClubId, sportId, users);

  res.status(200).json({ wasSuccessful: success })
}

export default addAdminSportClubMembershipHandler;