import { Suspense } from "react"
import SpeedPageContent from "@/components/speed-page-content"

export default function SpeedPage() {
  return (
    <Suspense fallback={<div>Loading speed data...</div>}>
      <SpeedPageContent />
    </Suspense>
  )
}
