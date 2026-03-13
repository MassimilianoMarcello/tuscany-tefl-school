// sanity/schemaTypes/testimonial.ts
import { defineType, defineField } from "sanity"

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    // ─── Moderazione ─────────────────────────────────────────────────────────
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description: "Approve this testimonial to show it on the site",
      initialValue: false,
    }),

    // ─── Contenuto ───────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Review Title",
      type: "string",
    }),
    defineField({
      name: "review",
      title: "Review Text",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      description: "Rating from 1 to 5",
      options: {
        list: [
          { title: "⭐ 1", value: 1 },
          { title: "⭐⭐ 2", value: 2 },
          { title: "⭐⭐⭐ 3", value: 3 },
          { title: "⭐⭐⭐⭐ 4", value: 4 },
          { title: "⭐⭐⭐⭐⭐ 5", value: 5 },
        ],
        layout: "radio",
      },
      initialValue: 5,
    }),

    // ─── Autore ──────────────────────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "state",
      title: "State / Country",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),

    // ─── Riferimento corso ───────────────────────────────────────────────────
    defineField({
      name: "courseAttended",
      title: "Course Attended",
      type: "reference",
      to: [{ type: "course" }],
      description: "Which course did this student attend?",
    }),
  ],

  // ─── Preview nello studio ─────────────────────────────────────────────────
  preview: {
    select: {
      title: "name",
      subtitle: "title",
      media: "image",
      published: "published",
      rating: "rating",
    },
    prepare({ title, subtitle, media, published, rating }) {
      const stars = rating ? "⭐".repeat(rating) : ""
      return {
        title: `${published ? "✅" : "⏸️"} ${title}`,
        subtitle: `${stars} ${subtitle ?? ""}`,
        media,
      }
    },
  },
})