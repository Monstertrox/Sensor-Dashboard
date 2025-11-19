import type { ApiResponse, SensorReading, AppSensorType } from "./types"

// Función para obtener todos los datos de sensores
export async function fetchSensorData(): Promise<SensorReading[]> {
  try {
    const response = await fetch("/api/sensors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch sensor data")
    }

    return data.data || []
  } catch (error) {
    console.error("Error fetching sensor data:", error)
    throw error
  }
}

// Función para obtener datos de un tipo específico de sensor
export async function fetchSensorDataByType(sensorType: AppSensorType): Promise<SensorReading[]> {
  try {
    const response = await fetch(`/api/sensors?type=${sensorType}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch sensor data")
    }

    return data.data || []
  } catch (error) {
    console.error(`Error fetching ${sensorType} data:`, error)
    throw error
  }
}

// Función para insertar nuevos datos de sensor
export async function insertSensorData(
  nodo_id: string,
  tipo: string,
  valor: number,
  timestamp?: string,
): Promise<void> {
  try {
    const response = await fetch("/api/sensors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "insert_sensor_data",
        data: {
          nodo_id,
          tipo,
          valor,
          timestamp: timestamp || new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to insert sensor data")
    }
  } catch (error) {
    console.error("Error inserting sensor data:", error)
    throw error
  }
}

// Función para obtener el último valor de un sensor
export async function fetchLatestSensorValue(sensorType: AppSensorType): Promise<number> {
  const sensorData = await fetchSensorDataByType(sensorType)
  if (sensorData.length === 0) return 0

  // Ordenar por timestamp y obtener el más reciente
  const latest = sensorData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
  return latest.value
}
