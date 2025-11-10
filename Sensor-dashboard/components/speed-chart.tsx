"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SpeedChartProps {
  data?: { time: string; speed: number }[]
}

export default function SpeedChart({ data }: SpeedChartProps) {
  // Si no hay datos, devolvemos un mensaje en vez de hacer map()
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Sin datos de velocidad disponibles
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis label={{ value: "Velocidad (RPM)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Line type="monotone" dataKey="speed" stroke="#0070f3" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
