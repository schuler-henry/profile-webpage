import { NextApiRequest, NextApiResponse } from "next";
import { isPasswordValid } from "./requirements";

type Data = {
  wasSuccessful: boolean,
}

/**
 * Api Route to check whether password meets the requirements
 * @category API
 */
async function passwordValidHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const password: string = req.body.password;

  const isValid: boolean = isPasswordValid(password);

  res.status(200).json({ wasSuccessful: isValid })
}

export default passwordValidHandler;