import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  file: ArrayBuffer,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get a file from the database
 * @category API
 */
async function getFileFromBucketHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const bucketID: string = req.body.bucketID;
  const filePath: string = req.body.filePath;

  console.log(bucketID, filePath);
    
  const file: Blob = await BACK_END_CONTROLLER.getFileFromBucket(bucketID, filePath);
  console.log("FILE", JSON.stringify(file))
  let fileBuffer: ArrayBuffer;
  let resBuffer: Buffer;
  if (file !== null) {
    fileBuffer = await file.arrayBuffer();
    resBuffer = Buffer.from(fileBuffer);
    res.setHeader('Content-Type', 'application/pdf');
  } else {
    resBuffer = Buffer.from("File not found");
    res.setHeader('Content-Type', 'text/plain');
  }

  res.setHeader('Content-Length', resBuffer.length);
  res.setHeader('Content-Disposition', 'attachment; filename=' + filePath);
  res.write(resBuffer, 'binary')
  res.end();
}

export default getFileFromBucketHandler;