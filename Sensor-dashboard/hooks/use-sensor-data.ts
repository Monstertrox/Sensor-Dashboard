import { useQuery } from "@tanstack/react-query"
import { fetchSensorData, fetchSensorDataByType } from "@/lib/api"
import type { SensorData, SensorReading, AppSensorType } from "@/lib/types"

// Hook para obtener todos los datos de sensores
export function useSensorData() {
  return useQuery({
    queryKey: ["sensors"],
    queryFn: fetchSensorData,
    refetchInterval: 5000, // Actualizar cada 5 segundos
    staleTime: 1000, // Considerar datos obsoletos después de 1 segundo
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useSensorDataByType(sensorType: AppSensorType) {
  return useQuery({
    queryKey: ["sensors", sensorType],
    queryFn: () => fetchSensorDataByType(sensorType),
    refetchInterval: 5000,
    staleTime: 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useProcessedSensorData(sensorType: AppSensorType): {
  data: SensorData | undefined
  isLoading: boolean
  error: Error | null
  isUsingFallback: boolean
} {
  const { data: rawData, isLoading, error } = useSensorDataByType(sensorType)

  const processedData: SensorData | undefined = rawData
    ? {
        current: rawData.length > 0 ? rawData[rawData.length - 1].value : 0,
        min: getMinValue(sensorType),
        max: getMaxValue(sensorType),
        history: processHistoryData(rawData),
        lastUpdated: rawData.length > 0 ? rawData[rawData.length - 1].timestamp : new Date().toISOString(),
      }
    : undefined

  // Verificar si estamos usando datos de fallback
  const isUsingFallback = rawData?.some((reading) => reading.device_id?.includes("001")) || false

  return {
    data: processedData,
    isLoading,
    error,
    isUsingFallback,
  }
}

// Función auxiliar para obtener valores mínimos por tipo de sensor
function getMinValue(sensorType: AppSensorType): number {
  switch (sensorType) {
    case "temperature":
      return -10
    case "humidity":
      return 0
    case "air_quality":
      return 0
    case "pressure":
      return 950
    case "wind_speed":
      return 0
    case "ultrasound":
      return 0
    case "noise":
      return 30
    default:
      return 0
  }
}

// Función auxiliar para obtener valores máximos por tipo de sensor
function getMaxValue(sensorType: AppSensorType): number {
  switch (sensorType) {
    case "temperature":
      return 50
    case "humidity":
      return 100
    case "air_quality":
      return 400
    case "pressure":
      return 1050
    case "wind_speed":
      return 30
    case "ultrasound":
      return 500
    case "noise":
      return 120
    default:
      return 100
  }
}

// Función auxiliar para procesar datos históricos
function processHistoryData(readings: SensorReading[]): { time: string; value: number }[] {
  // Ordenar por timestamp
  const sortedReadings = readings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  // Tomar las últimas 24 lecturas o todas si hay menos
  const recentReadings = sortedReadings.slice(-24)

  return recentReadings.map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: reading.value,
  }))
}
