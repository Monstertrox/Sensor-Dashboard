import { Suspense } from "react"
import HumidityPageContent from "@/components/humidity-page-content"

export default function HumidityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HumidityPageContent />
    </Suspense>
  )
}