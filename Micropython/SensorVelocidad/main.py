from machine import Pin, I2C
import time
import utime
import math
import lora
from mpu6050 import MPU6050

# --- CONFIGURACIÓN ---
ID_NODO = "NODO_7"   # ✅ Nodo asignado
i2c = I2C(0, scl=Pin(22), sda=Pin(21))
mpu = MPU6050(i2c)

# --- CALIBRACIÓN INICIAL ---
print("Calibrando sensor MPU6050... No lo muevas durante 5 segundos.")
offset_x = 0
offset_y = 0
offset_z = 0
n = 100

for i in range(n):
    acc = mpu.leer_datos()
    offset_x += acc['AcX']
    offset_y += acc['AcY']
    offset_z += acc['AcZ']
    time.sleep(0.05)

offset_x /= n
offset_y /= n
offset_z /= n

print(f"Calibración completa:")
print(f"   Offset X={offset_x:.2f}, Y={offset_y:.2f}, Z={offset_z:.2f}")

# --- FUNCIÓN DE LECTURA Y CÁLCULO ---
def medir_velocidad():
    acc = mpu.leer_datos()
    ax = (acc['AcX'] - offset_x) / 16384.0 * 9.8
    ay = (acc['AcY'] - offset_y) / 16384.0 * 9.8
    az = (acc['AcZ'] - offset_z) / 16384.0 * 9.8

    magnitud = math.sqrt(ax**2 + ay**2 + az**2)

    # Filtrar ruido
    if magnitud < 0.3:
        return 0.0 
    else:
        return magnitud  # en m/s

# --- FUNCIÓN PARA FORMATEAR HORA ---
def hora_actual():
    t = utime.localtime(utime.time())
    return f"{t[0]}-{t[1]:02d}-{t[2]:02d} {t[3]:02d}:{t[4]:02d}:{t[5]:02d}"

# --- BUCLE PRINCIPAL ---
while True:
    velocidad = medir_velocidad()
    hora = hora_actual()

    mensaje = f"{ID_NODO},{velocidad:.2f},{hora}"
    
    print(f"Enviando por LoRa → {mensaje}\n")
     
    lora.enviar(mensaje)
    time.sleep(5)
