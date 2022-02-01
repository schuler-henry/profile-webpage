import { NextApiRequest, NextApiResponse } from "next";
import { isUsernameValid } from "./requirements";

type Data = {
  wasSuccessfull: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let username = req.body.username;

  let isNameValid = isUsernameValid(username);

  res.status(200).json({ wasSuccessfull: isNameValid })
}