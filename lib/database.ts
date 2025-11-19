import { neon } from "@neondatabase/serverless"

// Configuración de la base de datos Neon con fallback
let sql: any = null

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
    console.log("✅ Connected to Neon database")
  } else {
    console.warn("⚠️ DATABASE_URL not found, using fallback mode")
  }
} catch (error) {
  console.error("❌ Error connecting to database:", error)
}

export interface SensorRecord {
  id: number
  nodo_id: string
  tipo: string
  valor: number
  timestamp: string
}

// Función para obtener todos los datos de sensores
export async function getAllSensorData(): Promise<SensorRecord[]> {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  try {
    const result = await sql`
      SELECT id, nodo_id, tipo, valor, timestamp 
      FROM sensores 
      ORDER BY timestamp DESC 
      LIMIT 100
    `
    return result as SensorRecord[]
  } catch (error) {
    console.error("Error fetching sensor data:", error)
    throw new Error(`Database error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Función para obtener datos por tipo de sensor
export async function getSensorDataByType(tipo: string): Promise<SensorRecord[]> {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  try {
    const result = await sql`
      SELECT id, nodo_id, tipo, valor, timestamp 
      FROM sensores 
      WHERE tipo = ${tipo}
      ORDER BY timestamp DESC 
      LIMIT 50
    `
    return result as SensorRecord[]
  } catch (error) {
    console.error(`Error fetching ${tipo} data:`, error)
    throw new Error(`Database error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Función para obtener el último valor de un sensor
export async function getLatestSensorValue(tipo: string): Promise<SensorRecord | null> {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  try {
    const result = await sql`
      SELECT id, nodo_id, tipo, valor, timestamp 
      FROM sensores 
      WHERE tipo = ${tipo}
      ORDER BY timestamp DESC 
      LIMIT 1
    `
    return (result[0] as SensorRecord) || null
  } catch (error) {
    console.error(`Error fetching latest ${tipo} value:`, error)
    throw new Error(`Database error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Función para insertar un nuevo dato de sensor
export async function insertSensorData(nodo_id: string, tipo: string, valor: number, timestamp: string): Promise<void> {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  try {
    await sql`
      INSERT INTO sensores (nodo_id, tipo, valor, timestamp) 
      VALUES (${nodo_id}, ${tipo}, ${valor}, ${timestamp})
    `

    // Mantener solo los últimos 100 registros
    const count = await sql`SELECT COUNT(*) as count FROM sensores`
    const totalRecords = Number(count[0].count)

    if (totalRecords > 100) {
      const limite = totalRecords - 100
      await sql`
        DELETE FROM sensores 
        WHERE id IN (
          SELECT id FROM sensores 
          ORDER BY timestamp ASC 
          LIMIT ${limite}
        )
      `
    }
  } catch (error) {
    console.error("Error inserting sensor data:", error)
    throw new Error(`Database error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
