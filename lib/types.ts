export interface SensorRecord {
  id: number
  nodo_id: string
  tipo: string
  valor: number
  timestamp: string
}

export interface SensorReading {
  id: number
  sensor_type: "temperature" | "humidity" | "air_quality" | "pressure" | "wind_speed" | "ultrasound" | "noise"
  value: number
  timestamp: string
  device_id?: string
  location?: string
}

export interface SensorData {
  current: number
  min: number
  max: number
  history: { time: string; value: number }[]
  lastUpdated: string
}

export interface ApiResponse {
  success: boolean
  data: SensorReading[]
  source?: "database" | "fallback"
  message?: string
}

export const SENSOR_TYPE_MAPPING = {
  temperature: "temperature",
  humedad: "humidity",
  HUM: "humidity",
  calidad: "air_quality",
  presion: "pressure",
  PRESSURE: "pressure",
  pressure: "pressure",
  velocidad_viento: "wind_speed",
  WIND: "wind_speed",
  wind_speed: "wind_speed",
  ultrasonido: "ultrasound",
  ULTRASOUND: "ultrasound",
  ultrasound: "ultrasound",
  ruido: "noise",
  NOISE: "noise",
  noise: "noise",
} as const

export type DatabaseSensorType = keyof typeof SENSOR_TYPE_MAPPING
export type AppSensorType = (typeof SENSOR_TYPE_MAPPING)[DatabaseSensorType]
