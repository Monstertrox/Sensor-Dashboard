from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import psycopg2.extras

app = Flask(__name__)
CORS(app)

# Conexión a Neon PostgreSQL (CREDENCIALES ACTUALIZADAS)
db_1 = psycopg2.connect(
    host="ep-black-union-a4g7uw4x-pooler.us-east-1.aws.neon.tech",
    user="neondb_owner",
    password="npg_f3pSrie9ZTOc",
    database="neondb",
    port=5432,
    sslmode='require'
)

# Cursor con diccionarios para facilitar acceso por nombres de columnas
def get_cursor():
    return db_1.cursor(cursor_factory=psycopg2.extras.DictCursor)
@app.route("/insertar_dato", methods=["POST"])
def insertar_dato():
    data = request.json
    print("Datos recibidos:", data)
    try:
        cursor = get_cursor()
        
        sql = "INSERT INTO sensores (nodo_id, tipo, valor, timestamp) VALUES (%s, %s, %s, %s)"
        val = (data["id"], data["tipo"], float(data["valor"]), data["timestamp"])
        cursor.execute(sql, val)
        db_1.commit()

        # Mantener solo los últimos 100 registros
        cursor.execute("SELECT COUNT(*) FROM sensores")
        cantidad = cursor.fetchone()[0]
        if cantidad > 100:
            limite = cantidad - 100
            cursor.execute(
                "DELETE FROM sensores WHERE id IN (SELECT id FROM sensores ORDER BY timestamp ASC LIMIT %s)", (limite,)
            )
            db_1.commit()

        cursor.close()
        return jsonify({"status": "ok"})
    except Exception as e:
        print("Error en inserción:", e)
        return jsonify({"status": "error", "message": str(e)})

# Ruta para obtener los datos de los sensores más recientes
@app.route("/datos_sensores", methods=["GET"])
def obtener_datos_sensores():
    try:
        cursor = get_cursor()
        sensores = ['temperature', 'humedad', 'calidad']
        datos = []

        for sensor in sensores:
            cursor.execute("""
                SELECT * FROM sensores
                WHERE tipo = %s
                ORDER BY timestamp DESC
                LIMIT 1
            """, (sensor,))
            resultado = cursor.fetchone()
            if resultado:
                datos.append(dict(resultado))

        cursor.close()
        return jsonify(datos)
    except Exception as e:
        print(f"Error al obtener datos: {e}")
        return jsonify({"status": "error", "message": "No se pudieron obtener los datos"})

# Ruta para obtener el historial de temperatura
@app.route("/historial_temperatura", methods=["GET"])
def historial_temperatura():
    try:
        cursor = get_cursor()
        cursor.execute("""
            SELECT * FROM sensores
            WHERE tipo = 'temperature'
            ORDER BY timestamp DESC
            LIMIT 50
        """)
        resultados = cursor.fetchall()
        cursor.close()
        return jsonify([dict(row) for row in resultados])
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
# Ruta para obtener el historial de humedad
@app.route("/historial_humedad", methods=["GET"])
def historial_humedad():
    try:
        cursor = get_cursor()
        cursor.execute("""
            SELECT nodo_id, tipo, valor, timestamp FROM sensores
            WHERE tipo = 'HUM'
            ORDER BY timestamp ASC
            LIMIT 50
        """)
        resultados = cursor.fetchall()
        cursor.close()
        return jsonify([dict(row) for row in resultados])
    except Exception as e:
        print(f"Error al obtener historial humedad: {e}")
        return jsonify({"status": "error", "message": "No se pudo obtener historial"})

# Ruta para obtener el historial de calidad del aire
@app.route("/historial_calidad_aire", methods=["GET"])
def historial_calidad_aire():
    try:
        cursor = get_cursor()
        cursor.execute("""
            SELECT nodo_id, tipo, valor, timestamp FROM sensores
            WHERE tipo = 'calidad'
            ORDER BY timestamp ASC
            LIMIT 50
        """)
        resultados = cursor.fetchall()
        cursor.close()
        return jsonify([dict(row) for row in resultados])
    except Exception as e:
        print(f"Error al obtener historial calidad aire: {e}")
        return jsonify({"status": "error", "message": "No se pudo obtener historial"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)