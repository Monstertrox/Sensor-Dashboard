"use client";

import SensorLayout from "@/components/sensor-layout";
import SpeedSensor from "@/components/speed-sensor";
import SpeedChart from "@/components/speed-chart";

export default function SpeedPageContent() {
  // 🔹 Datos simulados con valor por defecto
  const data = [
    { time: "07:00", value: 1200 },
    { time: "07:01", value: 1300 },
    { time: "07:02", value: 1500 },
    { time: "07:03", value: 1700 },
  ];

  const currentSpeed = data?.[data.length - 1]?.value ?? 0;

  return (
    <SensorLayout
      title="Speed Sensor"
      description="Monitor real-time rotational speed (RPM)"
      currentValue={currentSpeed}
      unit="RPM"
      lastUpdated={new Date().toISOString()}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
        <div className="rounded-lg border p-6">
          <SpeedSensor value={currentSpeed} min={0} max={3000} />
        </div>
        <div className="rounded-lg border p-6">
          <SpeedChart data={Array.isArray(data) ? data : []} />
        </div>
      </div>
    </SensorLayout>
  );
}
