"use client"

import { Suspense } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import SensorLayout from "@/components/sensor-layout"
import UltrasoundChart from "@/components/ultrasound-chart"
import UltrasoundSensor from "@/components/ultrasound-sensor"
import { useProcessedSensorData } from "@/hooks/use-sensor-data"

export default function UltrasoundPageContent() {
  const { data, isLoading, error, isUsingFallback } = useProcessedSensorData("ultrasound")

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading ultrasound data: {error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <SensorLayout
      title="Ultrasound Sensor"
      description="Monitor distance measurements and historical data"
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
            <UltrasoundSensor value={data?.current || 0} min={data?.min || 0} max={data?.max || 500} />
          )}
        </div>

        <div>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <UltrasoundChart data={data?.history || []} />
          )}
        </div>
      </div>
    </SensorLayout>
  )
}
