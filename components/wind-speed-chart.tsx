"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WindSpeedDataPoint {
  time: string
  value: number
}

interface WindSpeedChartProps {
  data: WindSpeedDataPoint[]
}

export default function WindSpeedChart({ data }: WindSpeedChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wind Speed History</CardTitle>
        <CardDescription>Wind speed readings over time (m/s)</CardDescription>
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
            <Tooltip formatter={(value: number) => [`${value.toFixed(1)} m/s`, "Wind Speed"]} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#10b981" name="Wind Speed" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
