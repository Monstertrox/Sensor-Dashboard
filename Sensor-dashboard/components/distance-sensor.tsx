"use client"

import type React from "react"
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DistanceSensorProps {
  value: number
  min: number
  max: number
}

export default function DistanceSensor({ value: initialValue, min, max }: DistanceSensorProps) {
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

  // Define visual status and color according to distance
  const getDistanceStatus = (distance: number) => {
    if (distance < 6) return { status: "Too Close", color: "#ef4444" }       // rojo
    if (distance < 10) return { status: "Medium Range", color: "#f59e0b" }  // amarillo
    return { status: "Safe Distance", color: "#22c55e" }                    // verde
  }

  const { status, color } = getDistanceStatus(value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distance Sensor</CardTitle>
        <CardDescription>Real-time distance reading with manual adjustment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div
            className="flex flex-col items-center justify-center rounded-full w-32 h-32 border-8 transition-all duration-500"
            style={{ borderColor: color }}
          >
            <div className="text-3xl font-bold">{value.toFixed(1)}</div>
            <div className="text-xs text-center" style={{ color }}>
              {status}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">cm</div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Adjust Distance</h4>
            <Slider value={[value]} min={min} max={max} step={0.1} onValueChange={handleSliderChange} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{min} cm</span>
              <span>{max} cm</span>
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
            Range: {min} – {max} cm
          </span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
