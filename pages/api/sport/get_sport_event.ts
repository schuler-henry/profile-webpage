import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { ISportEvent } from "../../../interfaces/database";

type Data = {
  sportEvent: ISportEvent[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all sport events (valid token required)
 * @category API
 */
async function getSportEventsHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  
  const sportEvents: ISportEvent[] = await BACK_END_CONTROLLER.handleGetSportEvents(token);

  res.status(200).json({ sportEvent: sportEvents })
}

export default getSportEventsHandler;