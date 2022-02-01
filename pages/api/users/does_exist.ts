import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseConnection } from "../supabaseAPI"

type Data = {
  wasSuccessfull: boolean;
}

const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userID = req.body.userID;
  let username = req.body.username;

  let doesUserExist = await supabaseConnection.doesUserExist({id: userID, name: username})

  res.status(200).json({ wasSuccessfull: doesUserExist })
}