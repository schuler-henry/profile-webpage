import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  userToken: string,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to renew a token (+ update username)
 * @category API
 */
async function renewTokenHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;

  const userToken: string = await BACK_END_CONTROLLER.handleRenewToken(token);

  res.status(200).json({ userToken: userToken })
}

export default renewTokenHandler;