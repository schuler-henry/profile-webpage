import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseConnection } from "../supabaseAPI";

type Data = {
  wasSuccessfull: boolean;
}

const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let token = req.body.token;

  let isValid = await supabaseConnection.isUserTokenValid(token);

  res.status(200).json({ wasSuccessfull: isValid });
}