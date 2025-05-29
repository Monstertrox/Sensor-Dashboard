import type React from "react"
import Link from "next/link"

interface SensorLayoutProps {
  title: string
  description: string
  currentValue: number
  unit: string
  lastUpdated?: string
  children: React.ReactNode
}

export default function SensorLayout({
  title,
  description,
  currentValue,
  unit,
  lastUpdated,
  children,
}: SensorLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">Sensor Dashboard</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/temperature" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Temperature
              </Link>
              <Link href="/humidity" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Humidity
              </Link>
              <Link href="/air-quality" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Air Quality
              </Link>
            </nav>
          </div>
          <div className="flex md:hidden">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Sensor Dashboard</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2 md:hidden">
              <Link
                href="/temperature"
                className="px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Temperature
              </Link>
              <Link
                href="/humidity"
                className="px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Humidity
              </Link>
              <Link
                href="/air-quality"
                className="px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Air Quality
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">{title}</h1>
                <p className="text-gray-500 dark:text-gray-400">{description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-4xl font-bold">{currentValue}</div>
                <div className="text-2xl text-gray-500 dark:text-gray-400">{unit}</div>
              </div>
              {lastUpdated && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </div>
              )}
            </div>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </main>
    </div>
  )
}
