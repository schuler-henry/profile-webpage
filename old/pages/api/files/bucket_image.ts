import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get a file buffer from the supabase bucket
 * @category API
 */
async function getFile(req: NextApiRequest, res: NextApiResponse<any>) {
  const { bucketId, filePath } = req.query;

  const blob = await BACK_END_CONTROLLER.getFileFromBucket(bucketId.toString(), filePath.toString())
  const buffer = Buffer.from(await blob.arrayBuffer())

  res.setHeader('Content-Type', blob.type)
  res.send(buffer)
}

export default getFile;