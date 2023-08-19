import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  summaries: string[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all available summaries
 * @category API
 */
async function getAllSummaries(req: NextApiRequest, res: NextApiResponse<Data>) {
    
  const summaries: string[] = await BACK_END_CONTROLLER.handleGetAllSummaries();

  res.status(200).json({ summaries: summaries });
}

export default getAllSummaries;