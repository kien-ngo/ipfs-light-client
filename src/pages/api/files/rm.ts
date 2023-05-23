// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { BASE_URL } from "@/const";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path, isDirectory } = JSON.parse(req.body);
  await fetch(
    `${BASE_URL}/files/rm?arg=/${encodeURI(path)}&recursive=${isDirectory}`,
    {
      method: "POST",
    }
  );
  res.send("ok");
}
