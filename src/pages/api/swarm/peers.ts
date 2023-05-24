// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IOpenPeerModified, fetchOpenPeers } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IOpenPeerModified[]>
) {
  const peers = await fetchOpenPeers();
  res.json(peers);
}
