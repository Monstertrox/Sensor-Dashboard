// This file contains placeholder data for the sensors
// In a real application, this would be replaced with database queries

// Temperature data types
export interface TemperatureData {
  current: number
  min: number
  max: number
  history: { time: string; value: number }[]
}

// Humidity data types
export interface HumidityData {
  current: number
  min: number
  max: number
  history: { time: string; value: number }[]
}

// Air quality data types
export interface AirQualityData {
  current: number
  min: number
  max: number
  history: { time: string; value: number }[]
}

// Generate time labels for the past 24 hours
const generateTimeLabels = () => {
  const labels = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now)
    time.setHours(now.getHours() - i)
    labels.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }

  return labels
}

const timeLabels = generateTimeLabels()

// Generate temperature data
export function getTemperatureData(): TemperatureData {
  // Generate random temperature data between 15 and 30 degrees
  const history = timeLabels.map((time) => ({
    time,
    value: Math.round((15 + Math.random() * 15) * 10) / 10,
  }))

  const current = history[history.length - 1].value

  return {
    current,
    min: 0,
    max: 40,
    history,
  }
}

// Generate humidity data
export function getHumidityData(): HumidityData {
  // Generate random humidity data between 30 and 80 percent
  const history = timeLabels.map((time) => ({
    time,
    value: Math.round((30 + Math.random() * 50) * 10) / 10,
  }))

  const current = history[history.length - 1].value

  return {
    current,
    min: 0,
    max: 100,
    history,
  }
}

// Generate air quality data
export function getAirQualityData(): AirQualityData {
  // Generate random AQI data between 20 and 150
  const history = timeLabels.map((time) => ({
    time,
    value: Math.round(20 + Math.random() * 130),
  }))

  const current = history[history.length - 1].value

  return {
    current,
    min: 0,
    max: 400,
    history,
  }
}
