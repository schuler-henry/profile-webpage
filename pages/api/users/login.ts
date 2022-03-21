import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  userToken: string,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to login a user
 * @category API
 */
async function loginHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const username: string = req.body.username;
  const password: string = req.body.password;

  const token: string = await BACK_END_CONTROLLER.handleLoginUser(username, password);

  res.status(200).json({ userToken: token })
}

export default loginHandler;