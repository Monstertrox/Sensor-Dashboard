"use client"

import SensorLayout from "@/components/sensor-layout"
import AirQualityChart from "@/components/air-quality-chart"
import AirQualitySensor from "@/components/air-quality-sensor"
import { useProcessedSensorData } from "@/hooks/use-sensor-data"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AirQualityPageContent() {
  const { data, isLoading, error } = useProcessedSensorData("air_quality")

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>Error loading air quality data: {error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="container mx-auto p-4">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <SensorLayout
      title="Air Quality Sensor"
      description="Check air quality metrics and pollution levels"
      currentValue={data.current}
      unit="AQI"
      lastUpdated={data.lastUpdated}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Sensor Readings</h2>
          <div className="rounded-lg border p-6">
            <AirQualitySensor value={data.current} min={data.min} max={data.max} />
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Historical Data</h2>
          <div className="rounded-lg border p-6">
            <AirQualityChart data={data.history} />
          </div>
        </div>
      </div>
    </SensorLayout>
  )
}
