// app/api/sanity/faqs/route.ts
import { NextRequest, NextResponse } from "next/server"
import { writeClient } from "@/lib/sanity.write-client"
import { groq } from "next-sanity"
import { getSessionCookie } from "better-auth/cookies"

async function checkAdmin(req: NextRequest) {
  return !!getSessionCookie(req)
}

// GET — tutte le FAQ per l'admin
export async function GET(req: NextRequest) {
  if (!await checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const faqs = await writeClient.fetch(
    groq`*[_type == "faq"] | order(category asc, _createdAt asc){
      _id, question, answer, category, published, _createdAt
    }`
  )

  return NextResponse.json(faqs)
}

// PATCH — toggle published
export async function PATCH(req: NextRequest) {
  if (!await checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id, published } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await writeClient.patch(id).set({ published }).commit()
  return NextResponse.json({ success: true })
}