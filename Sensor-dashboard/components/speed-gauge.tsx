"use client"

import { motion } from "framer-motion"

interface SpeedGaugeProps {
  value: number
}

export default function SpeedGauge({ value }: SpeedGaugeProps) {
  const maxSpeed = 100
  const rotation = (value / maxSpeed) * 180

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Velocímetro</h2>
      <div className="relative w-48 h-24 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-full rounded-t-full border-4 border-gray-300 dark:border-gray-700" />
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-24 bg-blue-500 origin-bottom"
          animate={{ rotate: rotation - 90 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        />
      </div>
      <div className="mt-4 text-3xl font-bold">{value.toFixed(1)} RPM</div>
    </div>
  )
}
