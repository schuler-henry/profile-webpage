import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to update a user email
 * @category API
 */
async function updateUserEmailHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const newEmail: string = req.body.newEmail;

  const wasSuccessful: boolean = await BACK_END_CONTROLLER.handleUpdateEmail(userToken, newEmail);

  res.status(200).json({ wasSuccessful: wasSuccessful })
}

export default updateUserEmailHandler;