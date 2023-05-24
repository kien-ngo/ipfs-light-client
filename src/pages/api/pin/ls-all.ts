// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PinObj, fetchPins } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PinObj>
) {
  const { type } = JSON.parse(req.body);
  // SHould be "recursive" most of the time
  const pinLs = await fetchPins(type);
  res.json(pinLs);
}
