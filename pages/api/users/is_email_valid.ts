import { NextApiRequest, NextApiResponse } from "next";
import { isEmailValid } from "./requirements";

type Data = {
  wasSuccessful: boolean,
}

/**
 * Api Route to check whether email meets the requirements 
 * @category API
 */
async function emailValidHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const email: string = req.body.email;

  const isValid: boolean = isEmailValid(email);

  res.status(200).json({ wasSuccessful: isValid })
}

export default emailValidHandler;