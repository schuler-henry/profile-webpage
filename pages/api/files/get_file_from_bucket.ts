import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  content: string,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get a file from the bucket
 * @category API
 */
async function getFileFromBucket(req: NextApiRequest, res: NextApiResponse<Data>) {
  const bucketID: string = req.body.bucketID;
  const filePath: string = req.body.filePath;
    
  const content: string = await BACK_END_CONTROLLER.getFileFromBucket(bucketID, filePath);

  res.status(200).json({ content: content });
}

export default getFileFromBucket;