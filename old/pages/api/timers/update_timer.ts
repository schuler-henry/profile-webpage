import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { ITimer } from "../../../interfaces/database";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to update a timer
 * @category API
 */
async function updateTimerHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  const timer: ITimer = req.body.timer;
    
  const wasSuccessful: boolean = await BACK_END_CONTROLLER.handleUpdateTimer(token, timer);

  res.status(200).json({ wasSuccessful: wasSuccessful });
}

export default updateTimerHandler;