import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  activationCode: string,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get an activation code of a user (valid admin token required)
 * @category API
 */
async function getActivationCodeHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const userID: number = req.body.userID;
  
  const code: string = await BACK_END_CONTROLLER.handleGetActivationCode(userToken, userID);

  res.status(200).json({ activationCode: code })
}

export default getActivationCodeHandler;