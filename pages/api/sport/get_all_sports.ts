import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { ISport } from "../../../interfaces/database";

type Data = {
  sports: ISport[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all sports (valid token required)
 * @category API
 */
async function getAllSportsHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;
  
  const sports: ISport[] = await BACK_END_CONTROLLER.handleGetAllSports(token);

  res.status(200).json({ sports: sports })
}

export default getAllSportsHandler;