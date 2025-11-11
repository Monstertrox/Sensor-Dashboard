# === mpu6050.py ===
class MPU6050:
    def __init__(self, i2c, addr=0x68):
        self.i2c = i2c
        self.addr = addr
        self.i2c.writeto_mem(self.addr, 0x6B, b'\x00')  # Despierta el MPU6050

    def leer_datos(self):
        data = self.i2c.readfrom_mem(self.addr, 0x3B, 6)
        ax = int.from_bytes(data[0:2], 'big', True)
        ay = int.from_bytes(data[2:4], 'big', True)
        az = int.from_bytes(data[4:6], 'big', True)
        return {'AcX': ax, 'AcY': ay, 'AcZ': az}
