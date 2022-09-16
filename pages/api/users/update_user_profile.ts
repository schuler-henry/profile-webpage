import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { IUser } from "../../../interfaces/database";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to update a user profile (username, firstName, lastName)
 * @category API
 */
async function updateUserProfileHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const newUser: IUser = req.body.newUser;

  const wasSuccessful: boolean = await BACK_END_CONTROLLER.handleUpdateProfile(userToken, newUser);

  res.status(200).json({ wasSuccessful: wasSuccessful })
}

export default updateUserProfileHandler;