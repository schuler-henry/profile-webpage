import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to verify a user token
 * @category API
 */
async function verifyTokenHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;

  const isValid: boolean = await BACK_END_CONTROLLER.isUserTokenValid(token);

  res.status(200).json({ wasSuccessful: isValid });
}

export default verifyTokenHandler;