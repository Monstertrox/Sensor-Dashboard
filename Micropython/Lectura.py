from machine import Pin, SPI
import time
import network
import urequests
from sx127x import SX127x 

SSID = 'wifi'
PASSWORD = '12345678'

processing_packet = False  

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        wlan.connect(SSID, PASSWORD)
        while not wlan.isconnected():
            pass
    print('Conectado a WiFi:', wlan.ifconfig())

# Configura SPI y pines LoRa del gateway
spi = SPI(1, baudrate=10000000, polarity=0, phase=0,
          sck=Pin(18), mosi=Pin(23), miso=Pin(19))
pins = {'cs': Pin(5), 'reset': Pin(14), 'dio0': Pin(26)}

lora = SX127x(spi, pins, frequency=433E6)

connect_wifi()
print("Gateway LoRa activo y listo para recibir datos")

def process_packet(payload):
    global processing_packet
    if processing_packet:
        print("Paquete ignorado: todavía procesando otro")
        return

    processing_packet = True
    try:
        mensaje = payload.decode('utf-8').strip()
        print("Dato recibido:", mensaje)

        if mensaje.count("|") == 3:
            id_sensor, tipo, valor, timestamp = mensaje.split("|")
            json_payload = {
                "id": id_sensor,
                "tipo": tipo,
                "valor": valor,
                "timestamp": timestamp
            }
            try:
                res = urequests.post("http://192.168.188.180:5000/insertar_dato", json=json_payload)
                print("Respuesta del servidor:", res.text)
                res.close()
            except Exception as e:
                print("Error enviando al servidor:", e)
        else:
            print("Formato de paquete incorrecto:", mensaje)

    except Exception as e:
        print("Error decodificando paquete:", e)
    finally:
        processing_packet = False

def on_dio0_irq(pin):
    print("Interrupción DIO0: paquete recibido")
    if lora.received_packet():
        payload = lora.read_payload()
        process_packet(payload)

dio0 = pins['dio0']
dio0.irq(trigger=Pin.IRQ_RISING, handler=on_dio0_irq)

while True:
    time.sleep(1)
