import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to delete a timer
 * @category API
 */
async function deleteTimerHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  const timerId: number = req.body.timerId;
    
  const wasSuccessful: boolean = await BACK_END_CONTROLLER.handleDeleteTimer(token, timerId);

  res.status(200).json({ wasSuccessful: wasSuccessful });
}

export default deleteTimerHandler;