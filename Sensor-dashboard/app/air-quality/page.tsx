import { Suspense } from "react"
import AirQualityPageContent from "@/components/air-quality-page-content"

export default function AirQualityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AirQualityPageContent />
    </Suspense>
  )
}