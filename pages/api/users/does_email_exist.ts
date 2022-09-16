import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController"

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to check whether email exists
 * @category API
 */
async function doesEmailAlreadyExistHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const email: string = req.body.email;

  const doesEmailExist: boolean = await BACK_END_CONTROLLER.handleEmailAlreadyExists(email)

  res.status(200).json({ wasSuccessful: doesEmailExist })
}

export default doesEmailAlreadyExistHandler;