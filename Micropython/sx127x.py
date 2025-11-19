from machine import Pin, SPI
import time

# Registros y constantes
REG_FIFO = 0x00
REG_OP_MODE = 0x01
REG_FRF_MSB = 0x06
REG_FRF_MID = 0x07
REG_FRF_LSB = 0x08
REG_PA_CONFIG = 0x09
REG_LNA = 0x0C
REG_FIFO_ADDR_PTR = 0x0D
REG_FIFO_TX_BASE_ADDR = 0x0E
REG_FIFO_RX_BASE_ADDR = 0x0F
REG_FIFO_RX_CURRENT_ADDR = 0x10
REG_IRQ_FLAGS = 0x12
REG_RX_NB_BYTES = 0x13
REG_PKT_RSSI_VALUE = 0x1A
REG_MODEM_CONFIG_1 = 0x1D
REG_MODEM_CONFIG_2 = 0x1E
REG_PREAMBLE_MSB = 0x20
REG_PREAMBLE_LSB = 0x21
REG_PAYLOAD_LENGTH = 0x22
REG_MODEM_CONFIG_3 = 0x26
REG_DIO_MAPPING_1 = 0x40
REG_VERSION = 0x42

MODE_LONG_RANGE_MODE = 0x80
MODE_SLEEP = 0x00
MODE_STDBY = 0x01
MODE_TX = 0x03
MODE_RX_CONTINUOUS = 0x05

PA_BOOST = 0x80

IRQ_RX_DONE_MASK = 0x40
IRQ_TX_DONE_MASK = 0x08
IRQ_PAYLOAD_CRC_ERROR_MASK = 0x20

MAX_PKT_LENGTH = 255


class SX127x:
    def __init__(self, spi, pins, frequency=433E6):
        self.spi = spi
        self.cs = pins['cs']
        self.reset = pins['reset']
        self.dio0 = pins['dio0']

        self.cs.init(Pin.OUT, value=1)
        self.reset.init(Pin.OUT, value=1)
        self.dio0.init(Pin.IN)

        # Reset hardware
        self.reset.value(0)
        time.sleep(0.01)
        self.reset.value(1)
        time.sleep(0.01)

        version = self.read_register(REG_VERSION)
        if version != 0x12:
            raise Exception('LoRa module not found')

        self.sleep()
        self.write_register(REG_OP_MODE, MODE_LONG_RANGE_MODE)
        self.standby()

        self.set_frequency(frequency)
        self.write_register(REG_FIFO_TX_BASE_ADDR, 0)
        self.write_register(REG_FIFO_RX_BASE_ADDR, 0)

        self.write_register(REG_LNA, self.read_register(REG_LNA) | 0x03)
        self.write_register(REG_MODEM_CONFIG_3, 0x04)

        self.set_tx_power(17)
        self.set_mode_rx()

    def read_register(self, address):
        self.cs.value(0)
        self.spi.write(bytearray([address & 0x7F]))
        result = self.spi.read(1)
        self.cs.value(1)
        return result[0]

    def write_register(self, address, value):
        self.cs.value(0)
        self.spi.write(bytearray([address | 0x80, value]))
        self.cs.value(1)

    def set_frequency(self, frequency):
        frf = int((frequency * (2**19)) / 32000000)
        self.write_register(REG_FRF_MSB, (frf >> 16) & 0xFF)
        self.write_register(REG_FRF_MID, (frf >> 8) & 0xFF)
        self.write_register(REG_FRF_LSB, frf & 0xFF)

    def set_tx_power(self, level):
        if level < 2:
            level = 2
        elif level > 17:
            level = 17
        self.write_register(REG_PA_CONFIG, PA_BOOST | (level - 2))

    def sleep(self):
        self.write_register(REG_OP_MODE, MODE_LONG_RANGE_MODE | MODE_SLEEP)

    def standby(self):
        self.write_register(REG_OP_MODE, MODE_LONG_RANGE_MODE | MODE_STDBY)

    def set_mode_rx(self):
        self.write_register(REG_OP_MODE, MODE_LONG_RANGE_MODE | MODE_RX_CONTINUOUS)

    def send(self, data):
        self.standby()
        self.write_register(REG_FIFO_ADDR_PTR, 0)
        for byte in data:
            self.write_register(REG_FIFO, byte)
        self.write_register(REG_PAYLOAD_LENGTH, len(data))
        self.write_register(REG_OP_MODE, MODE_LONG_RANGE_MODE | MODE_TX)

        while (self.read_register(REG_IRQ_FLAGS) & IRQ_TX_DONE_MASK) == 0:
            time.sleep(0.01)
        self.write_register(REG_IRQ_FLAGS, IRQ_TX_DONE_MASK)
        self.set_mode_rx()

    def received_packet(self):
        irq_flags = self.read_register(REG_IRQ_FLAGS)
        # Limpia flags de error CRC si existen
        if irq_flags & IRQ_PAYLOAD_CRC_ERROR_MASK:
            self.write_register(REG_IRQ_FLAGS, IRQ_PAYLOAD_CRC_ERROR_MASK)
            return False
        return (irq_flags & IRQ_RX_DONE_MASK) != 0

    def read_payload(self):
        fifo_addr = self.read_register(REG_FIFO_RX_CURRENT_ADDR)
        self.write_register(REG_FIFO_ADDR_PTR, fifo_addr)
        packet_len = self.read_register(REG_RX_NB_BYTES)
        payload = bytearray()
        for _ in range(packet_len):
            payload.append(self.read_register(REG_FIFO))
        # Limpia flags IRQ
        self.write_register(REG_IRQ_FLAGS, IRQ_RX_DONE_MASK | IRQ_PAYLOAD_CRC_ERROR_MASK)
        return payload
