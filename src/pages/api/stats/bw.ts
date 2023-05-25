// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { BASE_URL } from "@/const";
import { TBandwidthStats } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TBandwidthStats>
) {
  const stats: TBandwidthStats = await fetch(`${BASE_URL}/stats/bw`, {
    method: "POST",
  }).then((r) => r.json());
  res.json(stats);
}
