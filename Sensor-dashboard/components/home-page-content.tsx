"use client"

import Link from "next/link"
import { useSensorData } from "@/hooks/use-sensor-data"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DebugPanel from "@/components/debug-panel"

export default function HomePageContent() {
  const { data: sensorData, isLoading, error } = useSensorData()

  // Obtener los últimos valores de cada tipo de sensor
  const getLatestValue = (sensorType: "temperature" | "humidity" | "air_quality") => {
    if (!sensorData) return 0
    const filtered = sensorData.filter((reading) => reading.sensor_type === sensorType)
    if (filtered.length === 0) return 0
    return filtered[filtered.length - 1].value
  }

  const temperatureValue = getLatestValue("temperature")
  const humidityValue = getLatestValue("humidity")
  const airQualityValue = getLatestValue("air_quality")

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
            </nav>
          </div>
          <div className="flex md:hidden">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Sensor Dashboard</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2 md:hidden">
              <Link
                href="/temperature"
                className="px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Temperature
              </Link>
              <Link
                href="/humidity"
                className="px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Humidity
              </Link>
              <Link
                href="/air-quality"
                className="px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Air Quality
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
                  Monitor your environmental sensors in real-time. View temperature, humidity, and air quality data.
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

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <Link
                href="/temperature"
                className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary"
              >
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
                      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Temperature</h3>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold text-orange-500">{temperatureValue.toFixed(1)}°C</div>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View temperature readings and historical data
                  </p>
                </div>
              </Link>
              <Link
                href="/humidity"
                className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary"
              >
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
                      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Humidity</h3>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold text-blue-500">{humidityValue.toFixed(1)}%</div>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Monitor humidity levels in your environment
                  </p>
                </div>
              </Link>
              <Link
                href="/air-quality"
                className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary"
              >
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
                      <path d="M8 2h8" />
                      <path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2" />
                      <path d="M7 15h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Air Quality</h3>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold text-green-500">{airQualityValue} AQI</div>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Check air quality metrics and pollution levels
                  </p>
                </div>
              </Link>
            </div>

            {/* Panel de debug - solo mostrar si hay errores o en desarrollo */}
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
