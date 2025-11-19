import { Suspense } from "react"
import type { Metadata } from "next"
import TemperaturePageContent from "@/components/temperature-page-content"
export const metadata: Metadata = {
  title: "Temperature Sensor",
  description: "Monitor temperature readings and historical data",
}

export default function TemperaturePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TemperaturePageContent />
    </Suspense>
  )
}