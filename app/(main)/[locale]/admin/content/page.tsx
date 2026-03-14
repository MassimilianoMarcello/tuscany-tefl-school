// app/(main)/[locale]/admin/content/page.tsx
import { verifyAdmin } from "@/lib/dal"
import { getTranslations } from "next-intl/server"
import { TestimonialsManager } from "@/components/admin/content/testimonials-manager"
import { CoursesManager } from "@/components/admin/content/courses-manager"
import { FaqsManager } from "@/components/admin/content/faqs-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default async function ContentManagementPage() {
  await verifyAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-blue">Content Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage courses, testimonials and FAQs directly from here.
          </p>
        </div>
        <Link
          href="/studio"
          target="_blank"
          className="flex items-center gap-2 text-sm text-brand-blue border border-brand-azure px-4 py-2 rounded-lg hover:bg-brand-bg transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Advanced Studio
        </Link>
      </div>

      <Tabs defaultValue="testimonials">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="testimonials">Reviews</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="faqs">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="testimonials" className="mt-6">
          <TestimonialsManager />
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <CoursesManager />
        </TabsContent>

        <TabsContent value="faqs" className="mt-6">
          <FaqsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}