import time
import network
import urequests
import utime
from machine import Pin, SPI
from sx127x import SX127x

# Configuración WiFi
SSID = 'wifi'
PASSWORD = '12345678'

# Configuración LoRa
spi = SPI(1, baudrate=10000000, polarity=0, phase=0,
          sck=Pin(18), mosi=Pin(23), miso=Pin(19))

lora = SX127x(spi=spi, pins={
    'cs': Pin(5),
    'reset': Pin(16),
    'dio0': Pin(17)
})

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('Conectando a WiFi...')
        wlan.connect(SSID, PASSWORD)
        for _ in range(20):  # Timeout de 20 intentos
            if wlan.isconnected():
                break
            time.sleep(1)
    print('Conectado a WiFi:', wlan.ifconfig())

def obtener_timestamp():
    t = utime.localtime()
    return "{}-{:02d}-{:02d} {:02d}:{:02d}:{:02d}".format(t[0], t[1], t[2], t[3], t[4], t[5])

def procesar_mensaje_lora():
    if lora.received_packet():
        payload = lora.read_payload()
        try:
            msg = payload.decode('utf-8')
            partes = msg.split('|')
            if len(partes) == 4:
                return {
                    "id": partes[0],
                    "tipo": partes[1],
                    "valor": float(partes[2]),
                    "timestamp": partes[3]
                }
        except:
            pass
    return None

def enviar_dato(dato):
    for intento in range(3):  # 3 reintentos
        try:
            res = urequests.post("http://192.168.254.180:5000/insertar_dato", json=dato, headers={'Connection':'close'})
            print(f"Enviado: {dato} - Respuesta: {res.text}")
            res.close()
            return True
        except Exception as e:
            print(f"Intento {intento+1} error:", e)
            time.sleep(2)
    return False

connect_wifi()
print("Gateway central listo")

ultimo_envio = time.time()
intervalo_envio = 5  # 5 segundos entre grupos de datos

while True:
    dato = procesar_mensaje_lora()
    if dato:
        if enviar_dato(dato):
            time.sleep(1)  # Pausa entre envíos exitosos
        else:
            time.sleep(5)  # Pausa más larga si falla
    
    time.sleep(0.5)