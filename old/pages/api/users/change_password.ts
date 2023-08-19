import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  wasSuccessful: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to change the password of the user
 * @category API
 */
async function changePasswordHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const oldPassword: string = req.body.oldPassword;
  const newPassword: string = req.body.newPassword;
    
  const wasSuccessful: boolean = await BACK_END_CONTROLLER.handleChangeUserPassword(userToken, oldPassword, newPassword);

  res.status(200).json({ wasSuccessful: wasSuccessful });
}

export default changePasswordHandler;