import { NextApiRequest, NextApiResponse } from "next";
import { isPasswordValid } from "./requirements";

type Data = {
  wasSuccessfull: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let password = req.body.password;

  let isValid = isPasswordValid(password);

  res.status(200).json({ wasSuccessfull: isValid })
}