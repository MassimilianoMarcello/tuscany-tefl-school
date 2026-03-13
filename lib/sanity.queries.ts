import type { PortableTextBlock } from "@portabletext/react"
// lib/sanity.queries.ts
// ✅ Tutte le query GROQ centralizzate in un unico file
//    Filtra published == true per courses, testimonials, faqs
import { groq } from "next-sanity"
import { client } from "./sanity.client"

// ─── Tipi ────────────────────────────────────────────────────────────────────
export type Course = {
  _id: string
  name: string
  startDate: string
  endDate: string
  price: number
  discount?: number
  completionTimeWeeks: number
  slug: string
  description: PortableTextBlock[] | string
  hours: number
  level: string
  photo: string
  featured?: boolean
  maxStudents?: number
}

export type Testimonial = {
  _id: string
  name: string
  city: string
  state: string
  review: string
  title: string
  rating?: number
  courseAttended?: { name: string; slug: string }
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
  answer: PortableTextBlock[] | string
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
  mainText: PortableTextBlock[] | string
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
    groq`*[_type == "course" && published == true] | order(startDate asc){
      _id,
      name,
      startDate,
      endDate,
      price,
      discount,
      completionTimeWeeks,
      "slug": slug.current,
      description,
      hours,
      level,
      featured,
      maxStudents,
      "photo": photo.asset->url
    }`
  )
}

export async function getFeaturedCourses(): Promise<Course[]> {
  return client.fetch(
    groq`*[_type == "course" && published == true && featured == true] | order(startDate asc)[0...4]{
      _id,
      name,
      startDate,
      endDate,
      price,
      discount,
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
    groq`*[_type == "course" && slug.current == $slug && published == true][0]{
      _id,
      name,
      startDate,
      endDate,
      price,
      discount,
      completionTimeWeeks,
      "slug": slug.current,
      description,
      hours,
      level,
      featured,
      maxStudents,
      "photo": photo.asset->url
    }`,
    { slug }
  )
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch(
    groq`*[_type == "testimonial" && published == true] | order(_createdAt desc){
      _id,
      name,
      city,
      state,
      review,
      title,
      rating,
      courseAttended->{ name, "slug": slug.current },
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
    groq`*[_type == "teachers"] | order(name asc){
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
    groq`*[_type == "faq" && published == true] | order(category asc, _createdAt asc){
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
    groq`*[_type == "slideItem"] | order(_createdAt asc){
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

export type CommonTopPage = {
  _id: string
  title: string
  subtitle?: string
  backgroundImage?: string
}

export async function getCommonTopPage(): Promise<CommonTopPage | null> {
  return client.fetch(
    groq`*[_type == "commonTopPage"][0]{
      _id,
      title,
      subtitle,
      "backgroundImage": backgroundImage.asset->url
    }`
  )
}