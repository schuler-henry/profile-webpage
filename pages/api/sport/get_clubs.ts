import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { ISportClub } from "../../../interfaces/database";

type Data = {
  clubs: ISportClub[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all sport clubs (valid token required)
 * @category API
 */
async function getSportClubsHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  
  const sportClubs: ISportClub[] = await BACK_END_CONTROLLER.handleGetSportClubs(token);

  res.status(200).json({ clubs: sportClubs })
}

export default getSportClubsHandler;