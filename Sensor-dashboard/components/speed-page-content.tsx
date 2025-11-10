"use client";

import SensorLayout from "@/components/sensor-layout";
import SpeedSensor from "@/components/speed-sensor";
import SpeedChart from "@/components/speed-chart";

export default function SpeedPageContent() {
  // 🔹 Simulación de datos de ejemplo
  const data = [
    { time: "07:00 p.m.", value: 1500 },
    { time: "07:01 p.m.", value: 1600 },
    { time: "07:02 p.m.", value: 1800 },
    { time: "07:03 p.m.", value: 1700 },
    { time: "07:04 p.m.", value: 1750 },
    { time: "07:05 p.m.", value: 1650 },
  ];

  const currentSpeed = data[data.length - 1]?.value ?? 0;

  return (
    <SensorLayout
      title="Speed Sensor"
      description="Monitor real-time rotational speed (RPM)"
      currentValue={currentSpeed}
      unit="RPM"
      lastUpdated={new Date().toISOString()}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
        {/* Sensor gauge */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Sensor Readings</h2>
          <div className="rounded-lg border p-6">
            <SpeedSensor value={currentSpeed} min={0} max={3000} />
          </div>
        </div>

        {/* Historical data */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Historical Data</h2>
          <div className="rounded-lg border p-6">
            <SpeedChart data={data ?? []} />
          </div>
        </div>
      </div>
    </SensorLayout>
  );
}
