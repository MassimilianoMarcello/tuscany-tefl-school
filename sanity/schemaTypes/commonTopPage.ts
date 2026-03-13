// sanity/schemaTypes/commonTopPage.ts
import { defineType, defineField } from "sanity"

export const commonTopPage = defineType({
  name: "commonTopPage",
  title: "Common Top Page",
  type: "document",
  fields: [
    // ✅ pageIdentifier — usato per filtrare nelle query (es. "reviews", "courses", "teachers")
    defineField({
      name: "pageIdentifier",
      title: "Page Identifier",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      description: "Unique identifier used to fetch this hero for a specific page (e.g. 'reviews', 'our-courses', 'teachers')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "pageIdentifier",
      media: "backgroundImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle?.current ?? "",
        media,
      }
    },
  },
})