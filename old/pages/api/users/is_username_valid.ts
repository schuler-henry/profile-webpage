import { NextApiRequest, NextApiResponse } from "next";
import { isUsernameValid } from "./requirements";

type Data = {
  wasSuccessful: boolean,
}

/**
 * Api Route to check whether username meets the requirements 
 * @category API
 */
async function usernameValidHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const username: string = req.body.username;

  const isNameValid: boolean = isUsernameValid(username);

  res.status(200).json({ wasSuccessful: isNameValid })
}

export default usernameValidHandler;