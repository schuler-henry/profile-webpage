import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to activate a user
 * @category API
 */
async function activateHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const username: string = req.body.username;
  const activationCode: string = req.body.activationCode;

  const activateUser: boolean = await BACK_END_CONTROLLER.handleActivateUser(username, activationCode);

  res.status(200).json({ wasSuccessful: activateUser })
}

export default activateHandler;