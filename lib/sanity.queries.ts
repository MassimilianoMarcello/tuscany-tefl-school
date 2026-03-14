// lib/sanity.queries.ts
// ✅ Query GROQ centralizzate
//    Filtra published == true per courses, testimonials, faqs

import { groq } from "next-sanity"
import { client } from "./sanity.client"
import type { PortableTextBlock } from "@portabletext/react"

// ─── Tipi ────────────────────────────────────────────────────────────────────

export type CommonTop = {
  _id: string
  title: string
  subtitle?: string
  backgroundImage?: string  // URL diretta risolta in GROQ
}

export type PageSection = {
  _key: string
  order?: number
  title: string
  subtitle?: string
  text?: string
  image?: {
    asset: { url: string }
    crop?: object
    hotspot?: object
  }
  content?: PortableTextBlock[]
}

export type PageType = {
  _id: string
  mainTitle: string
  pageType?: { current: string }
  mainImage?: {
    asset: { url: string }
    crop?: object
    hotspot?: object
  }
  sections: PageSection[]
}

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

// ─── CommonTopPage queries ────────────────────────────────────────────────────

/**
 * Fetch a single hero by pageIdentifier slug.
 * Usage: getCommonTopPageByIdentifier("work-in-italy")
 */
export async function getCommonTopPageByIdentifier(
  identifier: string
): Promise<CommonTop | null> {
  return client.fetch(
    groq`*[_type == "commonTopPage" && pageIdentifier.current == $identifier][0]{
      _id,
      title,
      subtitle,
      "backgroundImage": backgroundImage.asset->url
    }`,
    { identifier }
  )
}

/**
 * Fetch all hero sections (pick by _id client-side if needed).
 */
export async function getCommonTopPages(): Promise<CommonTop[]> {
  return client.fetch(
    groq`*[_type == "commonTopPage"]{
      _id,
      title,
      subtitle,
      "backgroundImage": backgroundImage.asset->url
    }`
  )
}

// ─── Page queries ─────────────────────────────────────────────────────────────

const PAGE_SECTIONS_FRAGMENT = groq`
  sections[]{
    _key,
    order,
    title,
    subtitle,
    text,
    image{
      asset->{ url },
      crop,
      hotspot
    },
    content[]
  }
`

/**
 * Fetch a page by Sanity _id.
 * Usage: getPages("2cbf78fc-12f1-4150-98cd-b3156f8cb098")
 */
export async function getPages(id: string): Promise<PageType> {
  return client.fetch(
    groq`*[_type == "page" && _id == $id][0]{
      _id,
      mainTitle,
      pageType,
      mainImage{
        asset->{ url },
        crop,
        hotspot
      },
      ${PAGE_SECTIONS_FRAGMENT}
    }`,
    { id }
  )
}

/**
 * Fetch a page by creation order index (0-based).
 */
export async function getPageByIndex(index: number): Promise<PageType> {
  return client.fetch(
    groq`*[_type == "page"] | order(_createdAt asc)[${index}]{
      _id,
      mainTitle,
      pageType,
      mainImage{
        asset->{ url },
        crop,
        hotspot
      },
      ${PAGE_SECTIONS_FRAGMENT}
    }`
  )
}

// ─── Course queries ───────────────────────────────────────────────────────────

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

// ─── Other queries ────────────────────────────────────────────────────────────

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

/**
 * Fetch only upcoming courses (startDate >= today), ordered chronologically.
 * "Spots left" will be calculated once booking logic is in place —
 * for now maxStudents is returned as the ceiling.
 */
export async function getUpcomingCourses(): Promise<Course[]> {
  const today = new Date().toISOString().split("T")[0] // "YYYY-MM-DD"
  return client.fetch(
    groq`*[
      _type == "course" &&
      published == true &&
      startDate >= $today
    ] | order(startDate asc){
      _id,
      name,
      startDate,
      endDate,
      price,
      discount,
      completionTimeWeeks,
      "slug": slug.current,
      hours,
      level,
      maxStudents
    }`,
    { today }
  )
}
 