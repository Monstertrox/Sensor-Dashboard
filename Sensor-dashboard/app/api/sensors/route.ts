import { NextResponse } from "next/server"
import { getAllSensorData, getSensorDataByType, insertSensorData } from "@/lib/database"
import { convertDbRecordsToReadings, generateFallbackData, mapToDbSensorType } from "@/lib/sensor-utils"
import type { AppSensorType } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sensorType = searchParams.get("type") as AppSensorType | null

    console.log("🔄 Fetching sensor data...")

    // Verificar si DATABASE_URL está disponible
    if (!process.env.DATABASE_URL) {
      console.log("⚠️ DATABASE_URL not available, using fallback data")
      const fallbackData = generateFallbackData()

      // Filtrar por tipo si se especifica
      const filteredData = sensorType
        ? fallbackData.filter((reading) => reading.sensor_type === sensorType)
        : fallbackData

      return NextResponse.json({
        success: true,
        data: filteredData,
        source: "fallback",
        message: "Using simulated data - DATABASE_URL not configured",
      })
    }

    let dbRecords
    if (sensorType) {
      const dbSensorType = mapToDbSensorType(sensorType)
      console.log(`📊 Fetching ${sensorType} data (DB type: ${dbSensorType})`)
      dbRecords = await getSensorDataByType(dbSensorType)
    } else {
      console.log("📊 Fetching all sensor data")
      dbRecords = await getAllSensorData()
    }

    console.log(`✅ Retrieved ${dbRecords.length} records from database`)

    // Convertir registros de DB a formato de aplicación
    const sensorReadings = convertDbRecordsToReadings(dbRecords)

    console.log(`✅ Converted to ${sensorReadings.length} sensor readings`)

    return NextResponse.json({
      success: true,
      data: sensorReadings,
      source: "database",
      count: sensorReadings.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error fetching sensor data:", error)
    console.log("🔄 Using fallback data instead")

    // Usar datos de fallback en caso de error
    const fallbackData = generateFallbackData()

    // Filtrar por tipo si se especifica
    const { searchParams } = new URL(request.url)
    const sensorType = searchParams.get("type") as AppSensorType | null
    const filteredData = sensorType
      ? fallbackData.filter((reading) => reading.sensor_type === sensorType)
      : fallbackData

    return NextResponse.json({
      success: true,
      data: filteredData,
      source: "fallback",
      message: `Database error: ${error.message}`,
      error_details: {
        type: error.name,
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    })
  }
}

// Endpoint para insertar nuevos datos
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("📝 Received request:", body)

    if (body.action === "insert_sensor_data") {
      if (!process.env.DATABASE_URL) {
        return NextResponse.json({
          success: false,
          error: "Database not configured - DATABASE_URL missing",
        })
      }

      const { nodo_id, tipo, valor, timestamp } = body.data

      // Validar datos requeridos
      if (!nodo_id || !tipo || valor === undefined || !timestamp) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required fields: nodo_id, tipo, valor, timestamp",
          },
          { status: 400 },
        )
      }

      // Insertar en la base de datos
      await insertSensorData(nodo_id, tipo, Number.parseFloat(valor), timestamp)

      console.log("✅ Sensor data inserted successfully")

      return NextResponse.json({
        success: true,
        message: "Sensor data inserted successfully",
      })
    }

    // Acción de debug para probar conexión
    if (body.action === "test_connection") {
      if (!process.env.DATABASE_URL) {
        return NextResponse.json({
          success: false,
          debug_info: {
            database_connected: false,
            error: "DATABASE_URL environment variable not set",
            available_env_vars: Object.keys(process.env).filter((key) => key.includes("DATABASE")),
            timestamp: new Date().toISOString(),
          },
        })
      }

      try {
        const testData = await getAllSensorData()
        return NextResponse.json({
          success: true,
          debug_info: {
            database_connected: true,
            record_count: testData.length,
            sample_record: testData[0] || null,
            timestamp: new Date().toISOString(),
          },
        })
      } catch (dbError) {
        return NextResponse.json({
          success: false,
          debug_info: {
            database_connected: false,
            error: dbError.message,
            timestamp: new Date().toISOString(),
          },
        })
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unknown action",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("❌ Error in POST endpoint:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
