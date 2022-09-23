import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { ISportClubMembership } from "../../../interfaces/database";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to delete a sport club membership
 * @category API
 */
async function deleteSportClubMembershipHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const sportClubMembership: ISportClubMembership = req.body.sportClubMembership;

  const success: boolean = await BACK_END_CONTROLLER.handleDeleteUserSportClubMembership(userToken, sportClubMembership);

  res.status(200).json({ wasSuccessful: success })
}

export default deleteSportClubMembershipHandler;