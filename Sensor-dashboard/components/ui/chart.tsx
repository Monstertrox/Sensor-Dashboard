"use client"

import type * as React from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

// Re-exportar todos los componentes de Recharts
export { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend }

// Componente de contenedor para gráficos
export interface ChartContainerProps {
  config: Record<string, { label: string; color: string }>
  className?: string
  children: React.ReactNode
}

export function ChartContainer({ config, className, children }: ChartContainerProps) {
  return (
    <div
      className={className}
      style={{ "--chart-1": config.fcf?.color, "--chart-2": config.pv?.color } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// Componente de tooltip personalizado
export interface ChartTooltipProps {
  content?: React.ComponentType<any>
}

export function ChartTooltip({ content }: ChartTooltipProps) {
  return <Tooltip content={content} />
}

export function ChartTooltipContent() {
  return null // Usar el tooltip por defecto de Recharts
}
