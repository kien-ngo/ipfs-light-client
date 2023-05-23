// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { BASE_URL } from "@/const";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { originalPath, newPath } = JSON.parse(req.body);
  const r = await fetch(
    `${BASE_URL}/files/cp?arg=/${encodeURI(originalPath)}&arg=/${encodeURI(
      newPath
    )}`,
    {
      method: "POST",
    }
  ).then((_r) => _r.text());
  console.log({ file_cp: r });
  res.send("ok");
}
