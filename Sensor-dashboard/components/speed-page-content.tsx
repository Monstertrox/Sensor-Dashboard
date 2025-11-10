"use client"

import SpeedChart from "./speed-chart"
import SpeedSensor from "./speed-sensor"
import SpeedGauge from "./speed-gauge"
import { useEffect, useState } from "react"

export default function SpeedPageContent() {
  const [speedData, setSpeedData] = useState<{ time: string; speed: number }[]>([])

  useEffect(() => {
    // Simulación o fetch real
    const interval = setInterval(() => {
      setSpeedData(prev => [
        ...prev.slice(-20),
        { time: new Date().toLocaleTimeString(), speed: Math.random() * 3000 },
      ])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold text-center">Sensor de Velocidad</h1>
      <SpeedGauge value={speedData.at(-1)?.speed ?? 0} />
      <SpeedChart data={speedData} />
      <SpeedSensor value={speedData.at(-1)?.speed ?? 0} />
    </div>
  )
}
