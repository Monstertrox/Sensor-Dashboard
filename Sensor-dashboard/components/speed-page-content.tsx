"use client"

import { useEffect, useState } from "react"
import SpeedChart from "./speed-chart"
import SpeedGauge from "./speed-gauge"
import SpeedSensor from "./speed-sensor"
import SensorLayout from "@/components/sensor-layout"

export default function SpeedPageContent() {
  const [speedData, setSpeedData] = useState<{ time: string; speed: number }[]>([])
  const [currentSpeed, setCurrentSpeed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const acceleration = Math.random() * 20 // Simula 0–20 m/s²
      setCurrentSpeed(acceleration)
      setSpeedData(prev => [
        ...prev.slice(-20),
        { time: new Date().toLocaleTimeString(), speed: acceleration },
      ])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <SensorLayout
      title="Sensor de Aceleración"
      description="Lecturas en tiempo real de la aceleración del sistema."
      currentValue={currentSpeed}
      unit="m/s²"
      lastUpdated={new Date().toISOString()}
    >
      <div className="grid gap-6 mt-6">
        <SpeedGauge value={currentSpeed} />
        <SpeedChart data={speedData} />
        <SpeedSensor value={currentSpeed} />
      </div>
    </SensorLayout>
  )
}
