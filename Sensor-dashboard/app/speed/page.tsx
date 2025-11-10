import { Suspense } from "react"
import SpeedPageContent from "@/components/speed-page-content"

export default function SpeedPage() {
  return (
    <Suspense fallback={<div>Cargando datos de aceleración...</div>}>
      <SpeedPageContent />
    </Suspense>
  )
}
