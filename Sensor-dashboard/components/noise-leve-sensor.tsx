"use client"

import type React from "react"
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NoiseLevelSensorProps {
  value: number
  min: number
  max: number
}

export default function NoiseLevelSensor({ value: initialValue, min, max }: NoiseLevelSensorProps) {
  const [value, setValue] = useState(initialValue)
  const [inputValue, setInputValue] = useState(initialValue.toString())

  const handleSliderChange = (newValue: number[]) => {
    setValue(newValue[0])
    setInputValue(newValue[0].toString())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    const newValue = Number.parseFloat(inputValue)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setValue(newValue)
    } else {
      setInputValue(value.toString())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newValue = Number.parseFloat(inputValue)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setValue(newValue)
    } else {
      setInputValue(value.toString())
    }
  }

  // Clasificación del nivel de ruido (según dB)
  const getNoiseLevelInfo = (db: number) => {
    if (db < 30) return { status: "Muy silencioso", color: "#22c55e" }
    if (db < 50) return { status: "Silencioso", color: "#84cc16" }
    if (db < 70) return { status: "Moderado", color: "#f59e0b" }
    if (db < 85) return { status: "Ruidoso", color: "#f97316" }
    if (db < 100) return { status: "Muy ruidoso", color: "#ef4444" }
    return { status: "Peligroso", color: "#7f1d1d" }
  }

  const { status, color } = getNoiseLevelInfo(value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor de Ruido</CardTitle>
        <CardDescription>Lectura actual del nivel de ruido con ajuste manual</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Valor actual */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div
            className="flex flex-col items-center justify-center rounded-full w-32 h-32 border-8 transition-all duration-500"
            style={{ borderColor: color }}
          >
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-xs text-center" style={{ color }}>
              {status}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">dB</div>
        </div>

        {/* Control de ajuste */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Ajustar Nivel de Ruido</h4>
            <Slider value={[value]} min={min} max={max} step={1} onValueChange={handleSliderChange} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{min} dB</span>
              <span>{max} dB</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              min={min}
              max={max}
              step={1}
              className="w-24"
            />
            <Button type="submit" size="sm">
              Establecer
            </Button>
          </form>
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        <div className="w-full flex justify-between">
          <span>
            Rango: {min} - {max} dB
          </span>
          <span>Última actualización: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
