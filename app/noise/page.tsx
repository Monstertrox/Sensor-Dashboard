import { Metadata } from "next"
import { Suspense } from "react"
import NoisePageContent from "@/components/noise-page-content"

export const metadata: Metadata = {
  title: "Noise Sensor",
  description: "Monitor noise level readings and historical data",
}

export default function NoisePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NoisePageContent />
    </Suspense>
  )
}
