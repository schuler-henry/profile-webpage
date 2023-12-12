import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  url: string,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get a file from the database
 * @category API
 */
async function getFileFromBucketHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const bucketID: string = req.body.bucketID;
  const filePath: string = req.body.filePath;
    
  const url: string = await BACK_END_CONTROLLER.getFileURLFromBucket(bucketID, filePath);

  res.status(200).json({ url: url });
}

export default getFileFromBucketHandler;