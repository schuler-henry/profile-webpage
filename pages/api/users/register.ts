import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseConnection } from "../supabaseAPI"
import isUsernameValid from "./requirements";

type Data = {
  wasSuccessfull: boolean;
}

const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let username = req.body.username;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  let userExists = await supabaseConnection.doesUserExist({name: username});

  let userCreate: boolean = false;

  if (isUsernameValid(username) && !userExists && (password === confirmPassword)) {
    userCreate = await supabaseConnection.registerUser({name: username, password: password});
  }

  res.status(200).json({ wasSuccessfull: userCreate })
}