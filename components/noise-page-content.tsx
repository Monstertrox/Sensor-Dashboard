"use client"

import { Suspense } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import SensorLayout from "@/components/sensor-layout"
import NoiseChart from "@/components/noise-chart"
import NoiseSensor from "@/components/noise-sensor"
import { useProcessedSensorData } from "@/hooks/use-sensor-data"

export default function NoisePageContent() {
  const { data, isLoading, error, isUsingFallback } = useProcessedSensorData("noise")

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading noise data: {error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <SensorLayout
      title="Noise Sensor"
      description="Monitor noise level readings and historical data"
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
            <NoiseSensor value={data?.current || 0} min={data?.min || 30} max={data?.max || 120} />
          )}
        </div>

        <div>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <NoiseChart data={data?.history || []} />
          )}
        </div>
      </div>
    </SensorLayout>
  )
}
