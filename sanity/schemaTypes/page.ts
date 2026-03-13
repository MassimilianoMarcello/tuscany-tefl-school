// sanity/schemaTypes/page.ts
import { defineType, defineField } from "sanity"

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    // ─── Tipo pagina ─────────────────────────────────────────────────────────
    defineField({
      name: "pageType",
      title: "Page Type",
      type: "slug",
      options: {
        source: "mainTitle",
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, " ")
            .split(" ")
            .map((word: string, index: number) =>
              index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(""),
      },
    }),

    // ─── Contenuto ───────────────────────────────────────────────────────────
    defineField({
      name: "mainTitle",
      title: "Main Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
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
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{ type: "pageSection" }],
    }),
  ],

  preview: {
    select: {
      title: "mainTitle",
      subtitle: "pageType.current",
      media: "mainImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: `📄 ${title ?? "Untitled"}`,
        subtitle: subtitle ?? "",
        media,
      }
    },
  },
})