// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { BASE_URL } from "@/const";
import type { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileName, downloadPath, cid } = JSON.parse(req.body);
  try {
    const response = await fetch(`${BASE_URL}/dag/export?arg=${cid}`);

    if (!response.ok || !response) {
      throw new Error("File download failed.");
    }
    const outputStream = fs.createWriteStream(downloadPath);
    response.body!.pipeTo(outputStream);
    return new Promise((resolve, reject) => {
      outputStream.on("finish", resolve);
      outputStream.on("error", reject);
    });
  } catch (err) {
    console.error("Error occurred during file download:", err);
    throw err;
  }
}
