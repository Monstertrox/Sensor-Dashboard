import { Suspense } from "react"
import NoiseLevelPageContent from "@/components/noise-level-page-content"

export default function NoiseLevelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NoiseLevelPageContent />
    </Suspense>
  )
}
