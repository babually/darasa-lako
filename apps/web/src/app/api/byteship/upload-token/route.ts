import { ByteshipClient } from "@byteship/js"
import { NextResponse } from "next/server"

const byteship = new ByteshipClient({
  apiKey: process.env.BYTESHIP_API_KEY ?? "",
})

export async function POST() {
  const { uploadToken } = await byteship.createUploadToken({
    folder: "uploads",
    visibility: "public",
    maxUploadBytes: 10 * 1024 * 1024,
  })

  return NextResponse.json({
    token: uploadToken.token,
    expiresAt: uploadToken.expiresAt,
  })
}