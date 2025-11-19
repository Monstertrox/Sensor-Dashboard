"use client"

import { Suspense } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import SensorLayout from "@/components/sensor-layout"
import PressureChart from "@/components/pressure-chart"
import PressureSensor from "@/components/pressure-sensor"
import { useProcessedSensorData } from "@/hooks/use-sensor-data"

export default function PressurePageContent() {
  const { data, isLoading, error, isUsingFallback } = useProcessedSensorData("pressure")

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading pressure data: {error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <SensorLayout
      title="Pressure Sensor"
      description="Monitor atmospheric pressure readings and historical data"
    >
      {isUsingFallback && (
        <Alert>
          <AlertDescription>Currently showing simulated data</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <PressureSensor value={data?.current || 0} min={data?.min || 950} max={data?.max || 1050} />
          )}
        </div>

        <div>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <PressureChart data={data?.history || []} />
          )}
        </div>
      </div>
    </SensorLayout>
  )
}
