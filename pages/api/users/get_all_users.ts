import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { IUser } from "../../../interfaces/database";

type Data = {
  users: IUser[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all Users (valid token required)
 * @category API
 */
async function getAllUsersHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  
  const users: IUser[] = await BACK_END_CONTROLLER.handleGetAllUsers(userToken);

  res.status(200).json({ users: users })
}

export default getAllUsersHandler;