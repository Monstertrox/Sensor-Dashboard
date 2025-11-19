import { Metadata } from "next"
import { Suspense } from "react"
import WindSpeedPageContent from "@/components/wind-speed-page-content"

export const metadata: Metadata = {
  title: "Wind Speed Sensor",
  description: "Monitor wind speed readings and historical data",
}

export default function WindSpeedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WindSpeedPageContent />
    </Suspense>
  )
}