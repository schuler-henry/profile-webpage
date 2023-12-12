import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { ISportEventType } from "../../../interfaces/database";

type Data = {
  sportEventTypes: ISportEventType[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all sport event types (valid token required)
 * @category API
 */
async function getAllSportEventTypesHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  
  const sportEventTypes: ISportEventType[] = await BACK_END_CONTROLLER.handleGetAllSportEventTypes(token);

  res.status(200).json({ sportEventTypes: sportEventTypes })
}

export default getAllSportEventTypesHandler;