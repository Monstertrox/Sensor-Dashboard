"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HumidityDataPoint {
  time: string
  value: number
}

interface HumidityChartProps {
  data: HumidityDataPoint[]
}

export default function HumidityChart({ data }: HumidityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Humidity History</CardTitle>
        <CardDescription>Humidity readings over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis unit="%" />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Humidity"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}