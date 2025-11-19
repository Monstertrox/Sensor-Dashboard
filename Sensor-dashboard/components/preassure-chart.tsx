"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PressureDataPoint {
  time: string
  value: number
}

interface PressureChartProps {
  data: PressureDataPoint[]
}

export default function PressureChart({ data }: PressureChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pressure History</CardTitle>
        <CardDescription>Pressure readings over time (hPa)</CardDescription>
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
            <Tooltip formatter={(value: number) => [`${value.toFixed(1)} hPa`, "Pressure"]} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Pressure" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
