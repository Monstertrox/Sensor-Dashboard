"use client"

import type React from "react"
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PressureSensorProps {
  value: number
  min: number
  max: number
}

export default function PressureSensor({ value: initialValue, min, max }: PressureSensorProps) {
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

  // Calculate color based on pressure
  const getPressureColor = (pressure: number) => {
    if (pressure < 990) return "#0ea5e9" // Low - blue
    if (pressure < 1005) return "#22c55e" // Normal - green
    if (pressure < 1020) return "#f97316" // High - orange
    return "#ef4444" // Very high - red
  }

  const pressureColor = getPressureColor(value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pressure Sensor</CardTitle>
        <CardDescription>Current atmospheric pressure reading with manual adjustment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div
            className="flex items-center justify-center rounded-full w-32 h-32 border-8 transition-all duration-500"
            style={{ borderColor: pressureColor }}
          >
            <div className="text-4xl font-bold">{value.toFixed(1)}</div>
          </div>
          <div className="text-sm text-muted-foreground">hPa</div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Adjust Pressure</h4>
            <Slider value={[value]} min={min} max={max} step={0.1} onValueChange={handleSliderChange} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{min} hPa</span>
              <span>{max} hPa</span>
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
              step={0.1}
              className="w-24"
            />
            <Button type="submit" size="sm">
              Set
            </Button>
          </form>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="w-full flex justify-between">
          <span>
            Range: {min} - {max} hPa
          </span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
