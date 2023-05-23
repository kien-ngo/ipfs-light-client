import { BASE_URL } from "@/const";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await new Response(request.body).json();
  const { path, isDirectory } = body;
  await fetch(
    `${BASE_URL}/files/rm?arg=/${encodeURI(path)}&recursive=${isDirectory}`,
    {
      method: "POST",
    }
  );
  NextResponse.next();
}
