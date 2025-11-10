"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SpeedChartProps {
  data?: { time: string; speed: number }[]
}

export default function SpeedChart({ data = [] }: SpeedChartProps) {
  // Protección: si no hay datos, mostramos un mensaje seguro
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-400 p-4">
        No hay datos disponibles de velocidad.
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
        <Line type="monotone" dataKey="speed" stroke="#8884d8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
