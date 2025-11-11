import { Suspense } from "react"
import NoiseLevelPageContent from "@/components/noise-level-page-content"

export default function NoisePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NoiseLevelPageContent />
    </Suspense>
  )
}
