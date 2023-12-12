import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  activationCode: string,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to create a new account as an admin (valid token required)
 * @category API
 */
async function createUserAsAdminHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const username: string = req.body.username;
  const firstName: string = req.body.firstName;
  const lastName: string = req.body.lastName;
  
  const activationCode: string = await BACK_END_CONTROLLER.handleCreateUserAsAdmin(userToken, username, firstName, lastName);

  res.status(200).json({ activationCode: activationCode })
}

export default createUserAsAdminHandler;