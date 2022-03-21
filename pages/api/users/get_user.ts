import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { User } from "../../../interfaces";

type Data = {
  user: User,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get a User by token
 * @category API
 */
async function getUserHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  
  const user: User = await BACK_END_CONTROLLER.handleGetUserFromToken(token);

  res.status(200).json({ user: user })
}

export default getUserHandler;