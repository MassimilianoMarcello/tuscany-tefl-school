// app/api/sanity/images/route.ts
import { NextRequest, NextResponse } from "next/server"
import { writeClient } from "@/lib/sanity.write-client"
import { groq } from "next-sanity"
import { getSessionCookie } from "better-auth/cookies"

// GET — tutte le immagini esistenti su Sanity per la selezione
export async function GET(req: NextRequest) {
  if (!getSessionCookie(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const images = await writeClient.fetch(
    groq`*[_type == "sanity.imageAsset"] | order(_createdAt desc)[0...50]{
      _id,
      url,
      originalFilename,
      "width": metadata.dimensions.width,
      "height": metadata.dimensions.height
    }`
  )

  return NextResponse.json(images)
}