// app/(main)/[locale]/work-in-italy/page.tsx
import WorkInItalyData from "@/components/workInItaly/WorkInItalyData"
import CommonBottomPage from "@/components/workInItaly/BottomPage"
import { getPages } from "@/lib/sanity.queries"

const PAGE_ID = "2cbf78fc-12f1-4150-98cd-b3156f8cb098"

export default async function WorkInItalyPage() {
  const pageData = await getPages(PAGE_ID)

  return (
    <>
      <WorkInItalyData />
      <CommonBottomPage data={pageData} id={PAGE_ID} />
    </>
  )
}