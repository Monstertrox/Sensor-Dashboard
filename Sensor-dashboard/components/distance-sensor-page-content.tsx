"use client"

import SensorLayout from "@/components/sensor-layout"
import DistanceChart from "@/components/distance-sensor-chart"
import DistanceSensor from "@/components/distance-sensor"
import { useProcessedSensorData } from "@/hooks/use-sensor-data"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DistanceSensorPageContent() {
  const { data, isLoading, error } = useProcessedSensorData("distance_sensor")

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>Error loading distance sensor data: {error.message}</AlertDescription>
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
      title="Distance Sensor"
      description="Monitor distance readings between 4 and 15 cm in real time"
      currentValue={data.current}
      unit="cm"
      lastUpdated={data.lastUpdated}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Current Reading</h2>
          <div className="rounded-lg border p-6">
            <DistanceSensor value={data.current} min={4} max={15} />
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Historical Data</h2>
          <div className="rounded-lg border p-6">
            <DistanceChart data={data.history} />
          </div>
        </div>
      </div>
    </SensorLayout>
  )
}
