// lib/sanity.queries.ts
// ✅ Tutte le query GROQ centralizzate in un unico file
//    Riusa gli schemi del vecchio progetto Sanity (projectId: r8udx71r)

import { groq } from "next-sanity"
import { client } from "./sanity.client"

// ─── Tipi ────────────────────────────────────────────────────────────────────

export type Course = {
  _id: string
  name: string
  startDate: string
  endDate: string
  price: number
  completionTimeWeeks: number
  slug: string
  description: string
  hours: number
  level: string
  photo: string
}

export type Testimonial = {
  _id: string
  name: string
  city: string
  state: string
  review: string
  title: string
  image: {
    asset: { _id: string; url: string }
    crop?: object
    hotspot?: object
    alt?: string
  }
}

export type Teacher = {
  _id: string
  name: string
  role: string
  idPhoto: string
  infoParagraph: string
  slug: string
}

export type Faq = {
  _id: string
  question: string
  answer: string
  category: string
  _createdAt: string
}

export type SlideItem = {
  _id: string
  title: string
  subtitle: string
  text: string
  linkText: string
  slug: string
  image: string
  alt: string
}

export type HomePage = {
  _id: string
  mainTitle: string
  mainText: string
  bannerImage: string
  components: {
    _key: string
    title: string
    text: string
    image: string
  }[]
}

// ─── Query ───────────────────────────────────────────────────────────────────

export async function getCourses(): Promise<Course[]> {
  return client.fetch(
    groq`*[_type == "course"]{
      _id,
      name,
      startDate,
      endDate,
      price,
      completionTimeWeeks,
      "slug": slug.current,
      description,
      hours,
      level,
      "photo": photo.asset->url
    }`
  )
}

export async function getCourse(slug: string): Promise<Course> {
  return client.fetch(
    groq`*[_type == "course" && slug.current == $slug][0]{
      _id,
      name,
      startDate,
      endDate,
      price,
      completionTimeWeeks,
      "slug": slug.current,
      description,
      hours,
      level,
      "photo": photo.asset->url
    }`,
    { slug }
  )
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch(
    groq`*[_type == "testimonial"]{
      _id,
      name,
      city,
      state,
      review,
      title,
      image{
        asset->{ _id, url },
        crop,
        hotspot,
        alt
      }
    }`
  )
}

export async function getTeachers(): Promise<Teacher[]> {
  return client.fetch(
    groq`*[_type == "teachers"]{
      _id,
      name,
      role,
      "idPhoto": idPhoto.asset->url,
      infoParagraph,
      "slug": slug.current
    }`
  )
}

export async function getFaqs(): Promise<Faq[]> {
  return client.fetch(
    groq`*[_type == "faq"] | order(_createdAt asc){
      _id,
      question,
      answer,
      category,
      _createdAt
    }`
  )
}

export async function getSlideItems(): Promise<SlideItem[]> {
  return client.fetch(
    groq`*[_type == "slideItem"]{
      _id,
      title,
      subtitle,
      text,
      linkText,
      "slug": slug.current,
      "image": image.asset->url,
      alt
    }`
  )
}

export async function getHomePage(): Promise<HomePage | null> {
  return client.fetch(
    groq`*[_type == "homepage"][0]{
      _id,
      mainTitle,
      mainText,
      "bannerImage": bannerImage.asset->url,
      components[]{
        _key,
        title,
        text,
        "image": image.asset->url
      }
    }`
  )
}