"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface SpeedChartProps {
  data?: { time: string; value: number }[];
}

export default function SpeedChart({ data = [] }: SpeedChartProps) {
  // 🔒 Validar array antes de renderizar
  const safeData = Array.isArray(data) ? data : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speed History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis unit=" RPM" />
              <Tooltip
                formatter={(value: number) => [`${value} RPM`, "Speed"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
