# === lora.py ===
from machine import Pin, SPI
from sx127x import SX127x
import time

# Configuración del LoRa SX1278
lora_config = {
    'frequency': 433E6,       # Frecuencia (MHz, ajusta según tu módulo/región)
    'tx_power_level': 14,
    'signal_bandwidth': 125E3,
    'spreading_factor': 7,
    'coding_rate': 5, 
    'preamble_length': 8,
    'implicitHeader': False,
    'sync_word': 0x12,
    'enable_CRC': True
}

# Inicializa SPI para el LoRa SX1278
spi = SPI(1, baudrate=10000000, polarity=0, phase=0,
          sck=Pin(18), mosi=Pin(23), miso=Pin(19))

# Pines LoRa
cs = Pin(5, Pin.OUT)
reset = Pin(14, Pin.OUT)
dio0 = Pin(2, Pin.IN)

# Crear objeto LoRa
lora = SX127x(spi, cs, reset, dio0, parameters=lora_config)

# Función para enviar mensajes LoRa
def enviar(msg):
    print("📡 Enviando mensaje LoRa:", msg)
    lora.println(msg)
    time.sleep(0.5)
