"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SpeedGaugeProps {
  value: number;
  min?: number;
  max?: number;
}

export default function SpeedGauge({ value, min = 0, max = 3000 }: SpeedGaugeProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDisplayValue(value), 200);
    return () => clearTimeout(timeout);
  }, [value]);

  const percentage = ((displayValue - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <motion.path
            d="M10 50 A40 40 0 0 1 90 50"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray="126"
            strokeDashoffset={126 - (percentage * 126) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{displayValue.toFixed(0)}</span>
        </div>
      </div>
      <p className="text-gray-500 text-sm">RPM</p>
    </div>
  );
}
