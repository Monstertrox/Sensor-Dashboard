"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UltrasoundDataPoint {
  time: string
  value: number
}

interface UltrasoundChartProps {
  data: UltrasoundDataPoint[]
}

export default function UltrasoundChart({ data }: UltrasoundChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distance History</CardTitle>
        <CardDescription>Distance measurements over time (cm)</CardDescription>
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
            <Tooltip formatter={(value: number) => [`${value.toFixed(1)} cm`, "Distance"]} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8b5cf6" name="Distance" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
