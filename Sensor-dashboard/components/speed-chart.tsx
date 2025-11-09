"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

interface SpeedChartProps {
  data: number[]
}

export default function SpeedChart({ data }: SpeedChartProps) {
  const chartData = data.map((value, index) => ({
    name: `${index + 1}`,
    speed: value,
  }))

  return (
    <div className="w-full h-80 bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Histórico de Velocidad</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="speed" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
