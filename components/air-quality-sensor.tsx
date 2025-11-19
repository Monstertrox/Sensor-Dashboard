"use client"

import type React from "react"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AirQualitySensorProps {
  value: number
  min: number
  max: number
}

export default function AirQualitySensor({ value: initialValue, min, max }: AirQualitySensorProps) {
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

  // Get air quality status and color
  const getAirQualityInfo = (aqi: number) => {
    if (aqi <= 50) return { status: "Good", color: "#22c55e" }
    if (aqi <= 100) return { status: "Moderate", color: "#f59e0b" }
    if (aqi <= 150) return { status: "Unhealthy for Sensitive Groups", color: "#f97316" }
    if (aqi <= 200) return { status: "Unhealthy", color: "#ef4444" }
    if (aqi <= 400) return { status: "Very Unhealthy", color: "#9333ea" }
    return { status: "Hazardous", color: "#7f1d1d" }
  }

  const { status, color } = getAirQualityInfo(value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Air Quality Sensor</CardTitle>
        <CardDescription>Current air quality reading with manual adjustment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
          <div className="text-sm text-muted-foreground">AQI</div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Adjust Air Quality</h4>
            <Slider value={[value]} min={min} max={max} step={1} onValueChange={handleSliderChange} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{min} AQI</span>
              <span>{max} AQI</span>
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
              Set
            </Button>
          </form>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="w-full flex justify-between">
          <span>
            Range: {min} - {max} AQI
          </span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
