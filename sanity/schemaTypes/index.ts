// sanity/schemaTypes/index.ts
import { course } from "./course"
import { testimonial } from "./testimonial"
import { homepage } from "./homepage"
import { componentPrototype } from "./componentPrototype"
import { commonTopPage } from "./commonTopPage"
import { page } from "./page"
import { pageSection } from "./pageSection"
import { faq } from "./faq"
import { slideItem } from "./slideItem"
import { teachers } from "./teachers"
import { author } from "./author"

interface SchemaType {
    name: string
    type: string
    [key: string]: unknown
}

const schemaTypes: SchemaType[] = [
    // ─── Pagine ──────────────────────────────────────────────────────────────
    homepage,
    page,
    commonTopPage,
    // ─── Oggetti riutilizzabili ───────────────────────────────────────────────
    pageSection,
    componentPrototype,
    // ─── Contenuto ───────────────────────────────────────────────────────────
    course,
    testimonial,
    faq,
    slideItem,
    teachers,
    author,
]

export { schemaTypes }