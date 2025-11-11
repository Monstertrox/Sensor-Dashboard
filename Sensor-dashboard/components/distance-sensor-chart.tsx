"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DistanceDataPoint {
  time: string
  distance: number
}

interface DistanceChartProps {
  data: DistanceDataPoint[]
}

export default function DistanceChart({ data }: DistanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distance Sensor History</CardTitle>
        <CardDescription>Distance measurements (4–15 cm) over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                label={{ value: "Time", position: "insideBottomRight", offset: -5 }}
              />
              <YAxis 
                domain={[4, 15]} 
                unit=" cm" 
                label={{ value: "Distance (cm)", angle: -90, position: "insideLeft" }} 
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)} cm`, "Distance"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="distance"
                stroke="#3b82f6"
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
