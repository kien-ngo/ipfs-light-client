import { BASE_URL } from "@/const";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await new Response(request.body).json();
  const { originalPath, newPath } = body;
  const r = await fetch(
    `${BASE_URL}/files/cp?arg=/${encodeURI(originalPath)}&arg=/${encodeURI(
      newPath
    )}`,
    {
      method: "POST",
    }
  ).then((_r) => _r.text());
  console.log({ file_cp: r });
  NextResponse.next();
}
