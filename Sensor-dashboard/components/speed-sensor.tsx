"use client";

import SpeedGauge from "@/components/speed-gauge";
import { useState } from "react";

interface SpeedSensorProps {
  value: number;
  min?: number;
  max?: number;
}

export default function SpeedSensor({ value, min = 0, max = 3000 }: SpeedSensorProps) {
  const [manualSpeed, setManualSpeed] = useState(value);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Speed Sensor</h3>
        <SpeedGauge value={manualSpeed} min={min} max={max} />
      </div>

      {/* Control manual */}
      <div>
        <label className="text-sm font-medium">Adjust Speed</label>
        <input
          type="range"
          min={min}
          max={max}
          value={manualSpeed}
          onChange={(e) => setManualSpeed(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="number"
            min={min}
            max={max}
            value={manualSpeed}
            onChange={(e) => setManualSpeed(Number(e.target.value))}
            className="w-20 border rounded p-1 text-center"
          />
          <span className="text-sm text-gray-600">RPM</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Range: {min} - {max} RPM</p>
      </div>
    </div>
  );
}
