from machine import Pin, SPI
from sx127x import SX127x
import time
import network
import urequests

SSID = 'wifi'
PASSWORD = '12345678'

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        wlan.connect(SSID, PASSWORD)
        while not wlan.isconnected():
            pass
    print('Conectado a WiFi:', wlan.ifconfig())

# CONFIGURACIÓN DEL SX1278
spi = SPI(1, baudrate=10000000, polarity=0, phase=0, sck=Pin(5), mosi=Pin(27), miso=Pin(19))
pins = {'cs': Pin(18), 'reset': Pin(14), 'dio0': Pin(26)}
lora = SX127x(spi, pins, frequency=915E6)
lora.set_frequency(915)
lora.set_spreading_factor(7)
lora.set_bandwidth(125000)


connect_wifi()
print("Gateway LoRa activo")

# CICLO PRINCIPAL
while True:
    if lora.received_packet():
        payload = lora.read_payload().decode('utf-8')
        print("Dato recibido:", payload)

        if "|" in payload:
            data = payload.split("|")
            if len(data) == 4:
                id_sensor, tipo, valor, timestamp = data
                json_payload = {
                    "id": id_sensor,
                    "tipo": tipo,
                    "valor": valor,
                    "timestamp": timestamp
                }

                try:
                    res = urequests.post("http://10.11.0.64:5000/insertar_dato", json=json_payload)
                    print("Respuesta del servidor:", res.text)
                    res.close()
                except Exception as e:
                    print("Error al enviar:", e)

    time.sleep(1)
