import { Metadata } from "next"
import { Suspense } from "react"
import UltrasoundPageContent from "@/components/ultrasound-page-content"

export const metadata: Metadata = {
  title: "Ultrasound Sensor",
  description: "Monitor distance measurements and historical data",
}

export default function UltrasoundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UltrasoundPageContent />
    </Suspense>
  )
}