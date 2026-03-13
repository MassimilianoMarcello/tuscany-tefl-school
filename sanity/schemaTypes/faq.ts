// sanity/schemaTypes/faq.ts
import { defineType, defineField } from "sanity"

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General Questions", value: "general" },
          { title: "Paperwork and Documentation", value: "technical" },
          { title: "Living in Italy", value: "living" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "category",
      published: "published",
    },
    prepare({ title, subtitle, published }) {
      return {
        title: `${published ? "✅" : "⏸️"} ${title}`,
        subtitle,
      }
    },
  },
})