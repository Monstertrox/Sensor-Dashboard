import { Suspense } from "react"
import DistancePageContent from "@/components/distance-page-content"

export default function DistancePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DistancePageContent />
    </Suspense>
  )
}
