"use client"

import type React from "react"
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WindSpeedSensorProps {
  value: number
  min: number
  max: number
}

export default function WindSpeedSensor({ value: initialValue, min, max }: WindSpeedSensorProps) {
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

  // Calculate color based on wind speed
  const getWindSpeedColor = (speed: number) => {
    if (speed < 2) return "#22c55e" // Calm - green
    if (speed < 5) return "#84cc16" // Light breeze - lime
    if (speed < 10) return "#f97316" // Moderate wind - orange
    if (speed < 15) return "#ef4444" // Strong wind - red
    return "#991b1b" // Very strong - dark red
  }

  const windSpeedColor = getWindSpeedColor(value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wind Speed Sensor</CardTitle>
        <CardDescription>Current wind speed reading with manual adjustment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div
            className="flex items-center justify-center rounded-full w-32 h-32 border-8 transition-all duration-500"
            style={{ borderColor: windSpeedColor }}
          >
            <div className="text-4xl font-bold">{value.toFixed(1)}</div>
          </div>
          <div className="text-sm text-muted-foreground">m/s</div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Adjust Wind Speed</h4>
            <Slider value={[value]} min={min} max={max} step={0.1} onValueChange={handleSliderChange} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{min} m/s</span>
              <span>{max} m/s</span>
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
            Range: {min} - {max} m/s
          </span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
