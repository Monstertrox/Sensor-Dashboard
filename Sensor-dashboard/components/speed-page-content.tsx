"use client"

import { useEffect, useState } from "react"
import SpeedChart from "./speed-chart"
import SpeedGauge from "./speed-gauge"
import SpeedSensor from "./speed-sensor"

export default function SpeedPageContent() {
  const [speedData, setSpeedData] = useState<{ time: string; speed: number }[]>([])
  const [currentSpeed, setCurrentSpeed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const acceleration = Math.random() * 20 // simulación entre 0 y 20 m/s²
      setCurrentSpeed(acceleration)
      setSpeedData(prev => [
        ...prev.slice(-20),
        { time: new Date().toLocaleTimeString(), speed: acceleration },
      ])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-center">Sensor de Aceleración</h1>
      <SpeedGauge value={currentSpeed} />
      <SpeedChart data={speedData} />
      <SpeedSensor value={currentSpeed} />
    </div>
  )
}
