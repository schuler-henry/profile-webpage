import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to register a user
 * @category API
 */
async function registerHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const username: string = req.body.username;
  const password: string = req.body.password;

  const userCreate: boolean = await BACK_END_CONTROLLER.handleRegisterUser(username, password);

  res.status(200).json({ wasSuccessful: userCreate })
}

export default registerHandler;