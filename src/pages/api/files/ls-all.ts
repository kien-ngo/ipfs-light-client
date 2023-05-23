// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { FilePath, fetchFilePaths } from "../../../src/utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FilePath[]>
) {
  const files: FilePath[] = await fetchFilePaths();
  res.json(files);
}
