import { Metadata } from "next"
import { Suspense } from "react"
import PressurePageContent from "@/components/pressure-page-content"

export const metadata: Metadata = {
  title: "Pressure Sensor",
  description: "Monitor atmospheric pressure readings and historical data",
}

export default function PressurePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PressurePageContent />
    </Suspense>
  )
}
