import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to add a timer
 * @category API
 */
async function addTimerHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  const name: string = req.body.name;
    
  const wasSuccessful: boolean = await BACK_END_CONTROLLER.handleAddTimer(token, name);

  res.status(200).json({ wasSuccessful: wasSuccessful });
}

export default addTimerHandler;