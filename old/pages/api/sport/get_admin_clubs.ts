import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { ISportClub } from "../../../interfaces/database";

type Data = {
  clubs: ISportClub[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all sport clubs with memberships where user (token) is in a admin position
 * @category API
 */
async function getSportClubsHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  
  const sportClubs: ISportClub[] = await BACK_END_CONTROLLER.handleGetAdminSportClubs(token);

  res.status(200).json({ clubs: sportClubs })
}

export default getSportClubsHandler;