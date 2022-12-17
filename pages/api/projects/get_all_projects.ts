import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from "../../../controller/backEndController";
import { GitHubProject } from "../../../interfaces/database";

type Data = {
  projects: GitHubProject[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all git hub projects listed in the database.
 * @category API
 */
async function getProjectsHandler(req: NextApiRequest, res: NextApiResponse<Data>) {  
  const projects: GitHubProject[] = await BACK_END_CONTROLLER.handleGetGitHubProjects();

  res.status(200).json({ projects: projects })
}

export default getProjectsHandler;