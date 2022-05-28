import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import fs from 'fs';

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
    
  let content: string = BACK_END_CONTROLLER.getFileContent(filePath);

  content += "\n\n\n\n"
  content += process.cwd()
  content += "\n\n"
  content += fs.readdirSync("/", 'utf-8')

  res.status(200).json({ content: content });
}

export default getFileContent;