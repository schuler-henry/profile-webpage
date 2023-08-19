import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to delete a sport event (valid token required)
 * @category API
 */
async function deleteSportEventHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  const sportEventId: number = req.body.sportEventId;
  
  const wasSuccessful: boolean = await BACK_END_CONTROLLER.handleDeleteSportEvent(token, sportEventId);

  res.status(200).json({ wasSuccessful: wasSuccessful })
}

export default deleteSportEventHandler;