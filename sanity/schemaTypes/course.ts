// sanity/schemaTypes/course.ts
import { defineType, defineField } from "sanity"

export const course = defineType({
  name: "course",
  title: "Course",
  type: "document",
  fields: [
    // ─── Visibilità ──────────────────────────────────────────────────────────
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description: "Unpublish to hide the course without deleting it",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      description: "Show this course in the homepage preview",
      initialValue: false,
    }),

    // ─── Info principali ─────────────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Course Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: {
        hotspot: true, // ✅ ritaglio intelligente
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Important for SEO and accessibility",
        }),
      ],
    }),

    // ─── Dettagli corso ──────────────────────────────────────────────────────
    defineField({
      name: "level",
      title: "Level",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "Beginner" },
          { title: "Intermediate", value: "Intermediate" },
          { title: "Advanced", value: "Advanced" },
        ],
        layout: "radio", // ✅ più usabile nello studio
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hours",
      title: "Number of Hours",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "completionTimeWeeks",
      title: "Completion Time (weeks)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "maxStudents",
      title: "Max Students",
      type: "number",
      description: "Maximum number of students per course",
    }),

    // ─── Prezzi ──────────────────────────────────────────────────────────────
    defineField({
      name: "price",
      title: "Price (€)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "discount",
      title: "Discount (%)",
      type: "number",
      description: "Optional discount percentage",
      validation: (Rule) => Rule.min(0).max(100),
    }),

    // ─── Date ────────────────────────────────────────────────────────────────
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),

    // ─── Contenuto ───────────────────────────────────────────────────────────
    defineField({
      name: "description",
      title: "Course Description",
      type: "array", // ✅ rich text invece di plain text
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    }),
  ],

  // ─── Preview nello studio ─────────────────────────────────────────────────
  preview: {
    select: {
      title: "name",
      subtitle: "level",
      media: "photo",
      published: "published",
    },
    prepare({ title, subtitle, media, published }) {
      return {
        title: `${published ? "✅" : "⏸️"} ${title}`,
        subtitle,
        media,
      }
    },
  },
})