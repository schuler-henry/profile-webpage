import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../../interfaces";
import { SupabaseConnection } from "../supabaseAPI"

type Data = {
  user: IUser;
}

const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let token = req.body.token;
  
  let iUser = await supabaseConnection.getIUserFromToken(token);

  res.status(200).json({ user: iUser })
}