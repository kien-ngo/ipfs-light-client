// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PinObj, fetchPins } from "../../../src/utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PinObj>
) {
  const { type } = JSON.parse(req.body);
  // SHould be "recursive" most of the time
  const pinLs = await fetchPins(type);
  res.json(pinLs);
}
