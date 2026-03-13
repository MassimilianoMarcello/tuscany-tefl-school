// sanity/schemaTypes/homepage.ts
import { defineType, defineField } from "sanity"

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "mainTitle",
      title: "Main Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainText",
      title: "Main Text",
      type: "array", // ✅ rich text
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
    }),
    defineField({
      name: "bannerImage",
      title: "Banner Image",
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "components",
      title: "Sections",
      type: "array",
      of: [{ type: "componentPrototype" }],
      description: "Add content sections to the homepage",
    }),
  ],

  preview: {
    select: {
      title: "mainTitle",
      media: "bannerImage",
    },
  },
})