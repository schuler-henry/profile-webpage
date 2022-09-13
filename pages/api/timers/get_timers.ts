import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { ITimer } from "../../../interfaces/database";

type Data = {
  timers: ITimer[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all timers by token
 * @category API
 */
async function getTimersHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  
  const timers: ITimer[] = await BACK_END_CONTROLLER.handleGetTimersByToken(token);

  res.status(200).json({ timers: timers })
}

export default getTimersHandler;