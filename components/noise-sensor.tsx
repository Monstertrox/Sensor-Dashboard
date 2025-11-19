"use client"

import type React from "react"
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NoiseSensorProps {
  value: number
  min: number
  max: number
}

export default function NoiseSensor({ value: initialValue, min, max }: NoiseSensorProps) {
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

  // Calculate color based on noise level
  const getNoiseColor = (noise: number) => {
    if (noise < 60) return "#22c55e" // Quiet - green
    if (noise < 75) return "#84cc16" // Normal - lime
    if (noise < 85) return "#f97316" // Loud - orange
    if (noise < 100) return "#ef4444" // Very loud - red
    return "#991b1b" // Dangerous - dark red
  }

  const noiseColor = getNoiseColor(value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Noise Sensor</CardTitle>
        <CardDescription>Current noise level reading with manual adjustment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div
            className="flex items-center justify-center rounded-full w-32 h-32 border-8 transition-all duration-500"
            style={{ borderColor: noiseColor }}
          >
            <div className="text-4xl font-bold">{value.toFixed(1)}</div>
          </div>
          <div className="text-sm text-muted-foreground">dB</div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Adjust Noise Level</h4>
            <Slider value={[value]} min={min} max={max} step={0.1} onValueChange={handleSliderChange} />
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
            Range: {min} - {max} dB
          </span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
