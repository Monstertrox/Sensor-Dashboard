"use client"

interface SpeedSensorProps {
  value?: number
}

export default function SpeedSensor({ value = 0 }: SpeedSensorProps) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg text-center">
      <h3 className="text-lg font-semibold">Lectura actual</h3>
      <p className="text-3xl font-bold text-blue-500 mt-2">
        {value.toFixed(2)} m/s²
      </p>
    </div>
  )
}
