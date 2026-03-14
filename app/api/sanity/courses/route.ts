// app/api/sanity/courses/route.ts
import { NextRequest, NextResponse } from "next/server"
import { writeClient } from "@/lib/sanity.write-client"
import { groq } from "next-sanity"
import { getSessionCookie } from "better-auth/cookies"

async function checkAdmin(req: NextRequest) {
  const session = getSessionCookie(req)
  return !!session
}

// GET — tutti i corsi per l'admin
export async function GET(req: NextRequest) {
  if (!await checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const courses = await writeClient.fetch(
    groq`*[_type == "course"] | order(startDate asc){
      _id, name, hours, level, price, discount,
      startDate, endDate, completionTimeWeeks,
      published, featured, description,
      "photoId": photo.asset->_id,
      "photoUrl": photo.asset->url
    }`
  )

  return NextResponse.json(courses)
}

// POST — crea nuovo corso
export async function POST(req: NextRequest) {
  if (!await checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, hours, level, price, discount, startDate, endDate,
    completionTimeWeeks, description, photoId, published, featured } = body

  if (!name || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Genera slug dal nome
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const doc: { _type: string; [key: string]: unknown } = {
    _type: "course",
    name,
    slug: { _type: "slug", current: slug },
    hours: Number(hours),
    level,
    price: Number(price),
    discount: discount ? Number(discount) : undefined,
    startDate,
    endDate,
    completionTimeWeeks: Number(completionTimeWeeks),
    description,
    published: published ?? false,
    featured: featured ?? false,
  }

  // Aggiungi foto se selezionata
  if (photoId) {
    doc.photo = { _type: "image", asset: { _type: "reference", _ref: photoId } }
  }

  const created = await writeClient.create(doc)
  return NextResponse.json({ success: true, id: created._id })
}

// PATCH — aggiorna corso
export async function PATCH(req: NextRequest) {
  if (!await checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { id, ...fields } = body

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  // Converti photoId in riferimento Sanity
  if (fields.photoId) {
    fields.photo = { _type: "image", asset: { _type: "reference", _ref: fields.photoId } }
    delete fields.photoId
  }

  // Converti numeri
  if (fields.hours) fields.hours = Number(fields.hours)
  if (fields.price) fields.price = Number(fields.price)
  if (fields.discount) fields.discount = Number(fields.discount)
  if (fields.completionTimeWeeks) fields.completionTimeWeeks = Number(fields.completionTimeWeeks)

  await writeClient.patch(id).set(fields).commit()
  return NextResponse.json({ success: true })
}

// DELETE — elimina corso
export async function DELETE(req: NextRequest) {
  if (!await checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await writeClient.delete(id)
  return NextResponse.json({ success: true })
}