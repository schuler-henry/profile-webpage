import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";

type Data = {
  content: string,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to change the password of the user
 * @category API
 */
async function getFileContent(req: NextApiRequest, res: NextApiResponse<Data>) {
  const filePath: string = req.body.filePath;
  const fileName: string = req.body.fileName;
    
  const content: string = BACK_END_CONTROLLER.getFileContent(filePath, fileName);

  res.status(200).json({ content: content });
}

export default getFileContent;