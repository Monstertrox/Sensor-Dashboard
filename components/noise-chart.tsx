"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface NoiseDataPoint {
  time: string
  value: number
}

interface NoiseChartProps {
  data: NoiseDataPoint[]
}

export default function NoiseChart({ data }: NoiseChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Noise Level History</CardTitle>
        <CardDescription>Noise level readings over time (dB)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip formatter={(value: number) => [`${value.toFixed(1)} dB`, "Noise Level"]} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#f59e0b" name="Noise Level" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
