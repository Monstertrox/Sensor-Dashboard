import time
import network
import urequests
import utime
import random

SSID = 'FamiliaCardenas'
PASSWORD = 'Araminta28054022'

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        wlan.connect(SSID, PASSWORD)
        while not wlan.isconnected():
            pass
    print('Conectado a WiFi:', wlan.ifconfig())

def obtener_timestamp():
    t = utime.localtime()
    return "{}-{:02d}-{:02d} {:02d}:{:02d}:{:02d}".format(t[0], t[1], t[2], t[3], t[4], t[5])

def simular_sensor():
    # Simula los 3 sensores
    return {
        "temperature": round(random.uniform(20, 30), 2),
        "humedad": round(random.uniform(40, 80), 2),
        "calidad": round(random.uniform(10, 50), 2)
    }

connect_wifi()
print("Inicio envío datos sensores")

ID_NODO = "01"

while True:
    sensores = simular_sensor()
    timestamp = obtener_timestamp()

    for tipo, valor in sensores.items():
        mensaje = {
            "id": ID_NODO,
            "tipo": tipo,
            "valor": valor,
            "timestamp": timestamp
        }

        try:
            res = urequests.post("http://192.168.80.22:5000/insertar_dato", json=mensaje)
            print(f"Enviado: {mensaje} - Respuesta: {res.text}")
            res.close()
        except Exception as e:
            print("Error al enviar:", e)

    time.sleep(2)
