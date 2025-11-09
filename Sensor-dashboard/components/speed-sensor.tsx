"use client"

import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SpeedChart } from "@/components/speed-chart"
import { SpeedGauge } from "@/components/speed-gauge"

export default function SpeedSensor() {
  const [speed, setSpeed] = useState<number>(0)
  const [data, setData] = useState<{ time: string; value: number }[]>([])

  useEffect(() => {
    // Simulación: genera datos aleatorios cada 2 segundos
    const interval = setInterval(() => {
      const newSpeed = Math.floor(Math.random() * 100) // 0–100 km/h
      setSpeed(newSpeed)
      setData((prev) => [
        ...prev.slice(-9),
        { time: new Date().toLocaleTimeString(), value: newSpeed },
      ])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="shadow-lg border border-gray-200 bg-white/80 backdrop-blur-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Sensor de Velocidad
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 items-center">
        {/* Gauge circular */}
        <div className="flex justify-center">
          <SpeedGauge speed={speed} />
        </div>

        {/* Gráfica de historial */}
        <div className="h-48">
          <SpeedChart data={data} />
        </div>

        {/* Valor actual */}
        <div className="col-span-2 text-center mt-4">
          <p className="text-4xl font-bold text-blue-600">{speed} km/h</p>
          <p className="text-sm text-gray-500">Velocidad actual</p>
        </div>
      </CardContent>
    </Card>
  )
}
