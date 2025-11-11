"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface NoiseLevelDataPoint {
  time: string
  value: number
}

interface NoiseLevelChartProps {
  data: NoiseLevelDataPoint[]
}

export default function NoiseLevelChart({ data }: NoiseLevelChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nivel de Ruido Histórico</CardTitle>
        <CardDescription>Lecturas de nivel de ruido a lo largo del tiempo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}  // Formateamos el tiempo
              />
              <YAxis unit=" dB" />
              <Tooltip
                formatter={(value: number) => [`${value} dB`, "Nivel de Ruido"]}
                labelFormatter={(label) => `Hora: ${label}`}
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
