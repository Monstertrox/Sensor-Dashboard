#include <SPI.h>
#include <LoRa.h>
#include <Wire.h>
#include <WiFi.h>
#include "time.h"
#include <Adafruit_BMP280.h>  // Biblioteca para BMP280

// Configuración WiFi
const char* ssid     = "Galaxy A13";
const char* password = "laura123";

// Configuración NTP
const char* ntpServer =  "1.south-america.pool.ntp.org";
const long  gmtOffset_sec = -5 * 3600; // Colombia UTC-5
const int   daylightOffset_sec = 0;

// Pines LoRa
#define LORA_SCK  18
#define LORA_MISO 19
#define LORA_MOSI 23
#define LORA_SS   5
#define LORA_RST  14
#define LORA_DIO0 2
#define CCS811_ADDR 0x5A

// Sensor BMP280
Adafruit_BMP280 bmp;

unsigned long lastReconnectAttempt = 0;
const unsigned long reconnectInterval = 10000;
bool sensorIniciado = false;
bool bmpIniciado = false;
unsigned long startTime;
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 5000;  // 5 segundos

String ID_NODO_1 = "04";  // Puedes cambiar el ID del nodo aquí
String ID_NODO_2 = "03";  // Puedes cambiar el ID del nodo aquí

void setup() {
  Serial.begin(115200);
  Wire.begin();

  // Inicializar WiFi y hora
  setupWiFiHora();

  // Inicializar LoRa
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(433E6)) {
    Serial.println("Fallo al iniciar LoRa");
    while (1);
  }
  Serial.println("Transmisor LoRa listo");

  // Inicializar sensor CCS811
  Serial.println("Iniciando sensor CCS811...");
  sensorIniciado = iniciarSensor();
  
  // Inicializar sensor BMP280
  Serial.println("Iniciando sensor BMP280...");
  bmpIniciado = bmp.begin(0x76);  // Dirección I2C 0x76
  if (!bmpIniciado) {
    Serial.println("No se encontró el sensor BMP280, intentando con dirección 0x77...");
    bmpIniciado = bmp.begin(0x77);  // Intentar con dirección alternativa
  }
  
  if (bmpIniciado) {
    Serial.println("Sensor BMP280 iniciado correctamente");
    // Configurar el BMP280
    bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     // Modo de operación
                    Adafruit_BMP280::SAMPLING_X2,     // Temperatura
                    Adafruit_BMP280::SAMPLING_X16,    // Presión
                    Adafruit_BMP280::FILTER_X16,      // Filtro
                    Adafruit_BMP280::STANDBY_MS_500); // Tiempo standby
  } else {
    Serial.println("Fallo al iniciar BMP280!");
  }

  startTime = millis(); // Para tiempo de calentamiento
}

void loop() {
  unsigned long currentTime = millis();
  
  // Verificar y reconectar sensores si es necesario
  if (!sensorIniciado) {
    if (currentTime - lastReconnectAttempt > reconnectInterval) {
      Serial.println("Intentando reconectar CCS811...");
      sensorIniciado = iniciarSensor();
      lastReconnectAttempt = currentTime;
    }
  }
  
  if (!bmpIniciado) {
    if (currentTime - lastReconnectAttempt > reconnectInterval) {
      Serial.println("Intentando reconectar BMP280...");
      bmpIniciado = bmp.begin(0x76);
      if (!bmpIniciado) bmpIniciado = bmp.begin(0x77);
      lastReconnectAttempt = currentTime;
    }
  }

  // Esperar que el sensor CCS811 se estabilice
  if (currentTime - startTime < 20000) {
    Serial.println("Esperando que el sensor se estabilice...");
    delay(2000);
    return;
  }

  // Enviar datos cada 5 segundos
  if (currentTime - lastSendTime >= sendInterval) {
    enviarDatosSensores();
    lastSendTime = currentTime;
  }

  delay(100); // Pequeña pausa para evitar sobrecarga
}

// ==== Inicializar WiFi y sincronizar hora ====
void setupWiFiHora() {
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" conectado");

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    Serial.println("Esperando hora NTP...");
    delay(1000);
  }
  Serial.println("Hora sincronizada correctamente");
}

// ==== Inicializar sensor CCS811 ====
bool iniciarSensor() {
  Wire.beginTransmission(CCS811_ADDR);
  Wire.write(0xF4); // APP_START
  if (Wire.endTransmission() != 0) return false;
  delay(100);

  Wire.beginTransmission(CCS811_ADDR);
  Wire.write(0x00); // STATUS
  if (Wire.endTransmission(false) != 0) return false;
  Wire.requestFrom(CCS811_ADDR, 1);
  if (Wire.available() < 1) return false;
  uint8_t status = Wire.read();
  if (!(status & 0x10)) {
    Serial.println("APP no válida en CCS811");
    return false;
  }

  Wire.beginTransmission(CCS811_ADDR);
  Wire.write(0x01); // MEAS_MODE
  Wire.write(0x10); // Drive mode = 1s
  if (Wire.endTransmission() != 0) return false;

  Serial.println("Sensor CCS811 iniciado correctamente");
  return true;
}

// ==== Leer datos y enviar por LoRa ====
void enviarDatosSensores() {
  // Obtener timestamp actual
  struct tm timeinfo;
  getLocalTime(&timeinfo);
  char fechaHora[30];
  strftime(fechaHora, sizeof(fechaHora), "%Y-%m-%d %H:%M:%S", &timeinfo);

  // Leer datos del CCS811 si está disponible
  if (sensorIniciado) {
    if (leerDatosCCS811()) {
      // El mensaje CO2 se envía dentro de leerDatosCCS811()
    } else {
      Serial.println("Error leyendo datos CCS811.");
      leerErrores();
      sensorIniciado = false;
      lastReconnectAttempt = millis();
    }
  }

  // Leer y enviar datos del BMP280 si está disponible (solo presión)
  if (bmpIniciado) {
    float presion = bmp.readPressure() / 100.0F; // Convertir a hPa
    
    if (!isnan(presion)) {
      // Enviar presión
      String mensajePresion = ID_NODO_1 + "|" + "presion" + "|" + String(presion, 2) + "|" + fechaHora;
      Serial.println(mensajePresion);
      LoRa.beginPacket();
      LoRa.print(mensajePresion);
      LoRa.endPacket();
      delay(1000);  // Pausa entre mensajes
      
    } else {
      Serial.println("Error leyendo presión BMP280");
      bmpIniciado = false;
    }
  }
}

// ==== Leer datos del sensor CCS811 ====
bool leerDatosCCS811() {
  Wire.beginTransmission(CCS811_ADDR);
  Wire.write(0x00); // STATUS
  if (Wire.endTransmission(false) != 0) return false;
  Wire.requestFrom(CCS811_ADDR, 1);
  if (Wire.available() < 1) return false;
  uint8_t status = Wire.read();
  if (!(status & 0x08)) return false; // No hay datos nuevos

  Wire.beginTransmission(CCS811_ADDR);
  Wire.write(0x02); // ALG_RESULT_DATA
  if (Wire.endTransmission(false) != 0) return false;
  Wire.requestFrom(CCS811_ADDR, 8);
  if (Wire.available() < 8) return false;

  uint16_t eCO2 = Wire.read() << 8 | Wire.read();
  uint16_t TVOC = Wire.read() << 8 | Wire.read();
  Wire.read(); Wire.read(); Wire.read(); Wire.read(); // descartar los últimos 4 bytes

  // Obtener timestamp actual
  struct tm timeinfo;
  getLocalTime(&timeinfo);
  char fechaHora[30];
  strftime(fechaHora, sizeof(fechaHora), "%Y-%m-%d %H:%M:%S", &timeinfo);

  // Mensaje CO2
  String mensajeCO2 = ID_NODO_2 + "|" + "calidad" + "|" + String(eCO2) + "|" + fechaHora;
  Serial.println(mensajeCO2);
  LoRa.beginPacket();
  LoRa.print(mensajeCO2);
  LoRa.endPacket();
  delay(1000);  // Pausa entre mensajes


  return true;
}

// ==== Leer errores del sensor ====
void leerErrores() {
  Wire.beginTransmission(CCS811_ADDR);
  Wire.write(0xE0); // ERROR_ID
  if (Wire.endTransmission(false) != 0) return;
  Wire.requestFrom(CCS811_ADDR, 1);
  if (Wire.available()) {
    uint8_t error = Wire.read();
    Serial.print("Código de error: 0x");
    Serial.println(error, HEX);
  }
}

