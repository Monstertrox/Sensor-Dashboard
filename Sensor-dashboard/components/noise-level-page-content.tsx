"use client"

import SensorLayout from "@/components/sensor-layout"
import NoiseLevelChart from "@/components/noise-level-chart"
import NoiseLevelSensor from "@/components/noise-level-sensor"
import { useProcessedSensorData } from "@/hooks/use-sensor-data"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NoiseLevelPageContent() {
  // Obtenemos los datos del sensor de ruido
  const { data, isLoading, error } = useProcessedSensorData("noise_level")

  // Si ocurre un error, mostramos un mensaje
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>Error al cargar los datos del sensor de ruido: {error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Si los datos aún están cargando, mostramos placeholders
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

  // Renderizado principal del contenido del sensor
  return (
    <SensorLayout
      title="Sensor de Ruido"
      description="Monitorea los niveles de ruido en tiempo real y su evolución histórica"
      currentValue={data.current}
      unit="dB"
      lastUpdated={data.lastUpdated}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
        {/* Lectura actual del sensor */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Lecturas Actuales</h2>
          <div className="rounded-lg border p-6">
            <NoiseLevelSensor value={data.current} min={data.min} max={data.max} />
          </div>
        </div>

        {/* Gráfico histórico */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Datos Históricos</h2>
          <div className="rounded-lg border p-6">
            <NoiseLevelChart data={data.history} />
          </div>
        </div>
      </div>
    </SensorLayout>
  )
}
