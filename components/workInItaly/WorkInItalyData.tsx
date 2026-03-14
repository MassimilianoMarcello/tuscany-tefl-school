// components/Work_in_Italy/WorkInItalyData.tsx
import CommonTopPage from "./TopPage"
import { getCommonTopPageByIdentifier } from "@/lib/sanity.queries"

export default async function WorkInItalyData() {
  const data = await getCommonTopPageByIdentifier("work-in-italy")
  return <CommonTopPage data={data} />
}