// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { BASE_URL } from "@/const";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { hash } = JSON.parse(req.body);
  const r = await fetch(`${BASE_URL}/pin/add?arg=${hash}&recursive=true`, {
    method: "POST",
  }).then((_r) => _r.json());
  console.log({ pin_add: r });
  res.send("ok");
}
