import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { ISportEvent } from "../../../interfaces/database";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to update a sport event (valid token required)
 * @category API
 */
async function updateSportEventHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  const sportEvent: ISportEvent = req.body.sportEvent;
  
  const wasSuccessful: boolean = await BACK_END_CONTROLLER.handleUpdateSportEvent(token, sportEvent);

  res.status(200).json({ wasSuccessful: wasSuccessful })
}

export default updateSportEventHandler;