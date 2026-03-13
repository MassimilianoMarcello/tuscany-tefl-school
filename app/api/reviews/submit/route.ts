// app/api/reviews/submit/route.ts
// ✅ Salva il testimonial su Sanity con published: false
//    L'admin approva dalla dashboard o dallo studio
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "next-sanity"

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN, // ✅ token con permessi di scrittura
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const { name, city, state, title, review, rating } = await req.json()

    if (!name || !title || !review) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await writeClient.create({
      _type: "testimonial",
      name,
      city: city ?? "",
      state: state ?? "",
      title,
      review,
      rating: Number(rating) ?? 5,
      published: false, // ✅ bozza — l'admin approva
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Review submission error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}