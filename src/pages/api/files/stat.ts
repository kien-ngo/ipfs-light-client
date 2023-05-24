// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IFileStat, fetchFileStat } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IFileStat>
) {
  const { path } = JSON.parse(req.body);
  const fileStat: IFileStat = await fetchFileStat(path);
  res.json(fileStat);
}
