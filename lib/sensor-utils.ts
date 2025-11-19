import type { SensorRecord, SensorReading, DatabaseSensorType, AppSensorType } from "./types"
import { SENSOR_TYPE_MAPPING } from "./types"

// Convertir tipo de sensor de DB a formato de aplicación
export function mapSensorType(dbType: string): AppSensorType | null {
  const mappedType = SENSOR_TYPE_MAPPING[dbType as DatabaseSensorType]
  return mappedType || null
}

// Convertir tipo de aplicación a tipo de DB
export function mapToDbSensorType(appType: AppSensorType): string {
  const mapping = {
    temperature: "temperature",
    humidity: "humedad",
    air_quality: "calidad",
    pressure: "presion",
    wind_speed: "velocidad_viento",
    ultrasound: "ultrasonido",
    noise: "ruido",
  }
  return mapping[appType] || appType
}

// Convertir registro de DB a formato de aplicación
export function convertDbRecordToReading(record: SensorRecord): SensorReading | null {
  const sensorType = mapSensorType(record.tipo)
  if (!sensorType) return null

  return {
    id: record.id,
    sensor_type: sensorType,
    value: record.valor,
    timestamp: record.timestamp,
    device_id: record.nodo_id,
    location: "Sensor Network",
  }
}

// Convertir múltiples registros
export function convertDbRecordsToReadings(records: SensorRecord[]): SensorReading[] {
  return records.map(convertDbRecordToReading).filter((reading): reading is SensorReading => reading !== null)
}

// Generar datos de fallback realistas
export function generateFallbackData(): SensorReading[] {
  const now = new Date()
  const data: SensorReading[] = []

  // Generar datos para las últimas 24 horas
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)

    // Temperatura: 18-28°C
    data.push({
      id: data.length + 1,
      sensor_type: "temperature",
      value: Math.round((18 + Math.random() * 10 + Math.sin(i * 0.5) * 3) * 10) / 10,
      timestamp: timestamp.toISOString(),
      device_id: "nodo_temp_001",
      location: "Sensor Network",
    })

    // Humedad: 40-80%
    data.push({
      id: data.length + 1,
      sensor_type: "humidity",
      value: Math.round((40 + Math.random() * 40 + Math.cos(i * 0.3) * 10) * 10) / 10,
      timestamp: timestamp.toISOString(),
      device_id: "nodo_hum_001",
      location: "Sensor Network",
    })

    // Calidad del aire: 20-100 AQI
    data.push({
      id: data.length + 1,
      sensor_type: "air_quality",
      value: Math.round(20 + Math.random() * 80 + Math.sin(i * 0.2) * 15),
      timestamp: timestamp.toISOString(),
      device_id: "nodo_air_001",
      location: "Sensor Network",
    })

    // Presión: 990-1020 hPa
    data.push({
      id: data.length + 1,
      sensor_type: "pressure",
      value: Math.round((1005 + Math.random() * 15 + Math.sin(i * 0.4) * 5) * 10) / 10,
      timestamp: timestamp.toISOString(),
      device_id: "nodo_pressure_001",
      location: "Sensor Network",
    })

    // Velocidad del viento: 0-15 m/s
    data.push({
      id: data.length + 1,
      sensor_type: "wind_speed",
      value: Math.round((2 + Math.random() * 12 + Math.abs(Math.sin(i * 0.3)) * 5) * 10) / 10,
      timestamp: timestamp.toISOString(),
      device_id: "nodo_wind_001",
      location: "Sensor Network",
    })

    // Ultrasonido (distancia): 10-500 cm
    data.push({
      id: data.length + 1,
      sensor_type: "ultrasound",
      value: Math.round((150 + Math.random() * 200 + Math.sin(i * 0.6) * 50) * 10) / 10,
      timestamp: timestamp.toISOString(),
      device_id: "nodo_ultrasound_001",
      location: "Sensor Network",
    })

    // Ruido: 40-100 dB
    data.push({
      id: data.length + 1,
      sensor_type: "noise",
      value: Math.round((50 + Math.random() * 40 + Math.sin(i * 0.2) * 10) * 10) / 10,
      timestamp: timestamp.toISOString(),
      device_id: "nodo_noise_001",
      location: "Sensor Network",
    })
  }

  return data
}
