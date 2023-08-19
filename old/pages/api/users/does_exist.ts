import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController"

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to check whether username exists
 * @category API
 */
async function doesUserAlreadyExistHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const username: string = req.body.username;

  const doesUserExist: boolean = await BACK_END_CONTROLLER.handleUserAlreadyExists(username)

  res.status(200).json({ wasSuccessful: doesUserExist })
}

export default doesUserAlreadyExistHandler;