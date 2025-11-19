'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

type SliderProps = {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  onValueChange?: (value: number[]) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'min' | 'max' | 'step' | 'onChange'>

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      () => value?.[0] ?? defaultValue?.[0] ?? min,
    )

    React.useEffect(() => {
      if (value && typeof value[0] === 'number') {
        setInternalValue(value[0])
      }
    }, [value])

    const percent = React.useMemo(() => {
      const clampedMax = max - min === 0 ? 1 : max - min
      const raw = (((value ? value[0] : internalValue) - min) / clampedMax) * 100
      return Math.min(100, Math.max(0, raw))
    }, [value, internalValue, min, max])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value)

      if (!value) {
        setInternalValue(newValue)
      }

      onValueChange?.([newValue])
    }

    return (
      <div
        data-slot="slider"
        className={cn(
          'relative flex h-6 w-full items-center select-none data-[disabled=true]:opacity-50',
          className,
        )}
        data-disabled={disabled ? 'true' : undefined}
      >
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={value ? value[0] : internalValue}
          disabled={disabled}
          onChange={handleChange}
          className="relative z-10 h-full w-full appearance-none bg-transparent focus-visible:outline-hidden"
          {...props}
        />
        <div
          data-slot="slider-track"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-muted"
        />
        <div
          data-slot="slider-range"
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-primary"
          style={{ width: `${percent}%` }}
        />
        <div
          data-slot="slider-thumb"
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-4 w-4 -mt-2 rounded-full border border-primary bg-background shadow"
          style={{ left: `calc(${percent}% - 0.5rem)` }}
        />
      </div>
    )
  },
)

Slider.displayName = 'Slider'

export { Slider }
