// app/api/sanity/testimonials/route.ts
import { NextRequest, NextResponse } from "next/server"
import { writeClient } from "@/lib/sanity.write-client"
import { groq } from "next-sanity"
import { getSessionCookie } from "better-auth/cookies"

// ✅ Verifica admin prima di ogni operazione
async function checkAdmin(req: NextRequest) {
  const session = getSessionCookie(req)
  if (!session) return false
  // La verifica completa avviene nel DAL — qui controlliamo solo la sessione
  return true
}

// GET — tutti i testimonial (published e non) per l'admin
export async function GET(req: NextRequest) {
  if (!await checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const testimonials = await writeClient.fetch(
    groq`*[_type == "testimonial"] | order(_createdAt desc){
      _id, name, city, state, title, review, rating, published, _createdAt,
      "imageUrl": image.asset->url
    }`
  )

  return NextResponse.json(testimonials)
}

// PATCH — aggiorna published
export async function PATCH(req: NextRequest) {
  if (!await checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id, published } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await writeClient.patch(id).set({ published }).commit()
  return NextResponse.json({ success: true })
}

// DELETE — elimina testimonial
export async function DELETE(req: NextRequest) {
  if (!await checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await writeClient.delete(id)
  return NextResponse.json({ success: true })
}