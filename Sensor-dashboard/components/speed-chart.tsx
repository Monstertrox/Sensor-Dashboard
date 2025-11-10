"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SpeedChartProps {
  data?: { time: string; speed: number }[]
}

export default function SpeedChart({ data }: SpeedChartProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Sin datos de aceleración disponibles
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis label={{ value: "Aceleración (m/s²)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Line type="monotone" dataKey="speed" stroke="#0070f3" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
