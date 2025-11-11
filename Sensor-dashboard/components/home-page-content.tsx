"use client"

import Link from "next/link"
import { useSensorData } from "@/hooks/use-sensor-data"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DebugPanel from "@/components/debug-panel"

export default function HomePageContent() {
  const { data: sensorData, isLoading, error } = useSensorData()

  // Obtener los últimos valores de cada tipo de sensor
  const getLatestValue = (sensorType: "temperature" | "humidity" | "air_quality" | "distance") => {
    if (!sensorData) return 0
    const filtered = sensorData.filter((reading) => reading.sensor_type === sensorType)
    if (filtered.length === 0) return 0
    return filtered[filtered.length - 1].value
  }

  const temperatureValue = getLatestValue("temperature")
  const humidityValue = getLatestValue("humidity")
  const airQualityValue = getLatestValue("air_quality")
  const distanceValue = getLatestValue("distance") // 📏 Nueva variable: distancia

  // Verificar si estamos usando datos de fallback
  const isUsingFallback = sensorData?.some((reading) => reading.device_id?.includes("001")) || false

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">Sensor Dashboard</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/temperature" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Temperature
              </Link>
              <Link href="/humidity" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Humidity
              </Link>
              <Link href="/air-quality" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Air Quality
              </Link>
              <Link href="/distance" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Distance
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Sensor Monitoring System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Monitor your environmental sensors in real-time. View temperature, humidity, air quality, and distance data.
                </p>
              </div>
              {!isLoading && (
                <div className="text-sm text-gray-500 dark:text-gray-400">Live data updates every 5 seconds</div>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mt-6 max-w-2xl mx-auto">
                <AlertDescription>Error loading sensor data: {error.message}</AlertDescription>
              </Alert>
            )}

            {isUsingFallback && (
              <Alert className="mt-6 max-w-2xl mx-auto">
                <AlertDescription>
                  Currently showing simulated data. External sensor API is unavailable.
                </AlertDescription>
              </Alert>
            )}

            {/* Tarjetas de sensores */}
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-4 lg:gap-12 mt-12">
              {/* Temperature */}
              <SensorCard
                link="/temperature"
                title="Temperature"
                value={temperatureValue.toFixed(1) + "°C"}
                color="text-orange-500"
                isLoading={isLoading}
                description="View temperature readings and historical data"
                iconPath="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"
              />

              {/* Humidity */}
              <SensorCard
                link="/humidity"
                title="Humidity"
                value={humidityValue.toFixed(1) + "%"}
                color="text-blue-500"
                isLoading={isLoading}
                description="Monitor humidity levels in your environment"
                iconPath="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"
              />

              {/* Air Quality */}
              <SensorCard
                link="/air-quality"
                title="Air Quality"
                value={airQualityValue + " AQI"}
                color="text-green-500"
                isLoading={isLoading}
                description="Check air quality metrics and pollution levels"
                iconPath="M7 15h10"
              />

              {/* 📏 Distance */}
              <SensorCard
                link="/distance"
                title="Distance"
                value={distanceValue.toFixed(2) + " cm"}
                color="text-purple-500"
                isLoading={isLoading}
                description="Measure distance between 4 cm and 15 cm in real-time"
                iconPath="M4 12h16M4 12l4-4m-4 4l4 4" // Ícono tipo flechas
              />
            </div>

            {(error || isUsingFallback) && (
              <div className="mt-12 flex justify-center">
                <DebugPanel />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

// ✅ Componente reutilizable para tarjetas
function SensorCard({ link, title, value, color, isLoading, description, iconPath }) {
  return (
    <Link href={link} className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary">
      <div className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-primary/10 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d={iconPath} />
          </svg>
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        {isLoading ? <Skeleton className="h-8 w-16" /> : <div className={`text-2xl font-bold ${color}`}>{value}</div>}
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </Link>
  )
}
