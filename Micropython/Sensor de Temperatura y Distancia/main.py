from machine import Pin, SPI
from time import sleep, localtime, ticks_us
import dht
from sx127x import SX127x

# ===== CONFIGURACIÓN DE SENSORES =====
sensor = dht.DHT11(Pin(4))   # GPIO4 → DHT11
TRIG = Pin(15, Pin.OUT)      # GPIO15 → TRIG del HC-SR04
ECHO = Pin(2, Pin.IN)        # GPIO2  → ECHO del HC-SR04

# ===== CONFIGURACIÓN LoRa =====
spi = SPI(1, baudrate=10000000, polarity=0, phase=0,
          sck=Pin(18), mosi=Pin(23), miso=Pin(19))

lora = SX127x(spi=spi, pins={
    'cs': Pin(5),
    'reset': Pin(17),
    'dio0': Pin(16)
})

# ===== IDENTIFICADORES DE NODOS =====
ID_NODO_TEMP = "01"   # Nodo de temperatura
ID_NODO_DIST = "02"   # Nodo de distancia

INTERVALO = 1         # segundos entre lecturas/envíos

print("Nodo combinado (TEMP:03, DIST:04) listo")

# ===== FUNCIONES =====
def obtener_timestamp():
    hora = localtime()
    return "%04d-%02d-%02d %02d:%02d:%02d" % (hora[0], hora[1], hora[2], hora[3], hora[4], hora[5])

def medir_distancia():
    TRIG.off()
    sleep(0.002)
    TRIG.on()
    sleep(0.00001)
    TRIG.off()

    # Esperar respuesta del ECHO
    while ECHO.value() == 0:
        inicio = ticks_us()
    while ECHO.value() == 1:
        fin = ticks_us()

    duracion = fin - inicio
    distancia = (duracion * 0.0343) / 2  # cm
    return distancia

# ===== BUCLE PRINCIPAL =====
while True:
    try:
        # === LECTURA DE TEMPERATURA ===
        sensor.measure()
        temp = sensor.temperature()  # °C directos del DHT11

        # === LECTURA DE DISTANCIA ===
        distancia = medir_distancia()

        # === MENSAJES LoRa ===
        mensaje_temp = "{}|temperature|{}|{}".format(ID_NODO_TEMP, temp, obtener_timestamp())
        mensaje_dist = "{}|distance|{:.2f}|{}".format(ID_NODO_DIST, distancia, obtener_timestamp())

        # === ENVÍOS ===
        print("Enviando:", mensaje_temp)
        lora.send(bytes(mensaje_temp, 'utf-8'))
        sleep(0.5)

        print("Enviando:", mensaje_dist)
        lora.send(bytes(mensaje_dist, 'utf-8'))

        # Espera antes de siguiente ciclo
        sleep(INTERVALO)

    except OSError as e:
        print("Error sensor DHT11:", e)
        sleep(2)
    except Exception as e:
        print("Error general:", e)
        sleep(5)