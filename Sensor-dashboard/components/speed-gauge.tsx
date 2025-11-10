"use client"

import { useEffect, useState } from "react"

interface SpeedGaugeProps {
  value?: number
}

export default function SpeedGauge({ value = 0 }: SpeedGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="text-4xl font-semibold text-blue-600">
        {displayValue.toFixed(2)} m/s²
      </div>
      <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-4 bg-blue-500 transition-all duration-500"
          style={{ width: `${Math.min(displayValue / 40, 100)}%` }}
        ></div>
      </div>
    </div>
  )
}
