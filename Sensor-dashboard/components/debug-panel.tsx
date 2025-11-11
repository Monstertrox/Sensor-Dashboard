"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DistanceDebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [insertData, setInsertData] = useState({
    nodo_id: "distance_node_001",
    tipo: "distance_sensor",
    valor: "10.0", // Valor inicial dentro del rango de 4–15 cm
  })

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/sensors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "test_connection" }),
      })

      const data = await response.json()
      setDebugInfo(data)
    } catch (error: any) {
      setDebugInfo({
        success: false,
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const insertTestData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/sensors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "insert_sensor_data",
          data: {
            ...insertData,
            valor: Number.parseFloat(insertData.valor),
            timestamp: new Date().toISOString(),
          },
        }),
      })

      const data = await response.json()
      setDebugInfo(data)
    } catch (error: any) {
      setDebugInfo({
        success: false,
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Distance Sensor Debug Panel</CardTitle>
        <CardDescription>Test database connection and send distance readings (4–15 cm)</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Button onClick={testConnection} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test DB Connection"}
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Insert Test Distance Data</h4>

          <div className="grid grid-cols-2 gap-4">
            {/* Node ID */}
            <div>
              <Label htmlFor="nodo_id">Node ID</Label>
              <Input
                id="nodo_id"
                value={insertData.nodo_id}
                onChange={(e) => setInsertData({ ...insertData, nodo_id: e.target.value })}
              />
            </div>

            {/* Sensor Type */}
            <div>
              <Label htmlFor="tipo">Sensor Type</Label>
              <select
                id="tipo"
                value={insertData.tipo}
                onChange={(e) => setInsertData({ ...insertData, tipo: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="distance_sensor">Distance</option>
              </select>
            </div>

            {/* Distance Value */}
            <div>
              <Label htmlFor="valor">Distance (cm)</Label>
              <Input
                id="valor"
                type="number"
                step="0.1"
                min="4"
                max="15"
                value={insertData.valor}
                onChange={(e) => setInsertData({ ...insertData, valor: e.target.value })}
              />
            </div>

            {/* Insert Button */}
            <div className="flex items-end">
              <Button onClick={insertTestData} disabled={isLoading} className="w-full">
                {isLoading ? "Inserting..." : "Insert Distance"}
              </Button>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="space-y-4">
            <Alert variant={debugInfo.success ? "default" : "destructive"}>
              <AlertDescription>
                Status: {debugInfo.success ? "✅ Success" : "❌ Failed"}
                {debugInfo.error && ` - ${debugInfo.error}`}
                {debugInfo.message && ` - ${debugInfo.message}`}
              </AlertDescription>
            </Alert>

            {debugInfo.debug_info && (
              <div className="space-y-2">
                <h4 className="font-semibold">Database Information:</h4>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-96">
                  {JSON.stringify(debugInfo.debug_info, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
