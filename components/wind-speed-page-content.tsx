"use client"

import { Suspense } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import SensorLayout from "@/components/sensor-layout"
import WindSpeedChart from "@/components/wind-speed-chart"
import WindSpeedSensor from "@/components/wind-speed-sensor"
import { useProcessedSensorData } from "@/hooks/use-sensor-data"

export default function WindSpeedPageContent() {
  const { data, isLoading, error, isUsingFallback } = useProcessedSensorData("wind_speed")

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading wind speed data: {error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <SensorLayout
      title="Wind Speed Sensor"
      description="Monitor wind speed readings and historical data"
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
            <WindSpeedSensor value={data?.current || 0} min={data?.min || 0} max={data?.max || 30} />
          )}
        </div>

        <div>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <WindSpeedChart data={data?.history || []} />
          )}
        </div>
      </div>
    </SensorLayout>
  )
}
