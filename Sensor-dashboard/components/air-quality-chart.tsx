"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AirQualityDataPoint {
  time: string
  value: number
}

interface AirQualityChartProps {
  data: AirQualityDataPoint[]
}

export default function AirQualityChart({ data }: AirQualityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Air Quality History</CardTitle>
        <CardDescription>Air quality readings over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis unit=" AQI" />
              <Tooltip
                formatter={(value: number) => [`${value} AQI`, "Air Quality"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
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
