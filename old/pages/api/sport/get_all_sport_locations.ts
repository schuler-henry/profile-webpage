import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { ISportLocation } from "../../../interfaces/database";

type Data = {
  sportLocations: ISportLocation[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all sport locations (valid token required)
 * @category API
 */
async function getAllSportLocationsHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  
  const sportLocations: ISportLocation[] = await BACK_END_CONTROLLER.handleGetAllSportLocations(token);

  res.status(200).json({ sportLocations: sportLocations })
}

export default getAllSportLocationsHandler;