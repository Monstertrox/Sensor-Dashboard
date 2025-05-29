"use client"

import type React from "react"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HumiditySensorProps {
  value: number
  min: number
  max: number
}

export default function HumiditySensor({ value: initialValue, min, max }: HumiditySensorProps) {
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

  // Calculate fill percentage for the humidity indicator
  const fillPercentage = ((value - min) / (max - min)) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Humidity Sensor</CardTitle>
        <CardDescription>Current humidity reading with manual adjustment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-8 border-muted overflow-hidden">
              <div
                className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500"
                style={{ height: `${fillPercentage}%` }}
              ></div>
            </div>
            <div className="relative z-10 text-4xl font-bold">{value.toFixed(1)}</div>
          </div>
          <div className="text-sm text-muted-foreground">%</div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Adjust Humidity</h4>
            <Slider value={[value]} min={min} max={max} step={0.1} onValueChange={handleSliderChange} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{min}%</span>
              <span>{max}%</span>
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
            Range: {min}% - {max}%
          </span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
