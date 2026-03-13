// sanity.config.ts
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
// sanity.config.ts

import { schemaTypes } from "./sanity/schemaTypes"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: "default",
  title: "Tuscany TEFL School",

  projectId,
  dataset,

  plugins: [
    structureTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})