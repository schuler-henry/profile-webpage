import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { IUser } from "../../../interfaces/database";

type Data = {
  users: IUser[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to find Users by a given search string (valid token required)
 * @category API
 */
async function findUsersHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const searchString: string = req.body.searchString;
  
  const users: IUser[] = await BACK_END_CONTROLLER.handleSearchUsers(userToken, searchString);

  res.status(200).json({ users: users })
}

export default findUsersHandler;