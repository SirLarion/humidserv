#include <Adafruit_NeoPixel.h>
#include <HttpClient.h>
#include <SHTSensor.h>
#include <SPI.h>
#include <TimeLib.h>
#include <WiFiNINA.h>
#include <Wire.h>

#include "secrets.h"

#define SPIWIFI SPI     // The SPI port
#define SPIWIFI_SS 13   // Chip select pin
#define ESP32_RESETN 12 // Reset pin
#define SPIWIFI_ACK 11  // a.k.a BUSY or READY pin
#define ESP32_GPIO0 -1

#define LED 40

SHTSensor sht(SHTSensor::SHTC3);

Adafruit_NeoPixel pixel(1, LED, NEO_GRB + NEO_KHZ800);
int status = WL_IDLE_STATUS;

bool prevReadSuccessful = false;

const char *ssid = SECRET_SSID;
const char *pwd = SECRET_PWD;

WiFiClient wifi;
HttpClient http = HttpClient(wifi, SECRET_IP, SECRET_PORT);

void setPixelHigh() {
  pixel.setBrightness(10);
  pixel.setPixelColor(0, pixel.Color(70, 10, 50));
  pixel.show();
}

void setPixelLow() {
  pixel.setBrightness(0);
  pixel.setPixelColor(0, pixel.Color(70, 10, 50));
  pixel.show();
}

void displayInitialized() {
  for (int i = 0; i < 5; i++) {
    setPixelHigh();
    delay(100);
    setPixelLow();
    delay(50);
  }
}

void setup() {
  Wire.begin();

  Serial.begin(9600);
  pixel.begin();

  delay(1000);

  // attempt to connect to Wifi network
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);

    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pwd);

    for (int i = 0; i < 5; i++) {
      setPixelHigh();
      delay(100);
      setPixelLow();
      delay(900);
    }
  }

  if (sht.init()) {
    Serial.println("SHT init succeeded");
  } else {
    while (true) {
      Serial.println("SHT init failed");
      delay(100);
    }
  }
  displayInitialized();
}

void loop() {
  // Take a measurement every hour and send the data to the server
  if ((second() == 0 && minute() == 0) || !prevReadSuccessful) {
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("Error: Not connected to WiFi");
      prevReadSuccessful = false;
    } else if (!sht.readSample()) {
      Serial.println("Error: Failed to read sample");
      prevReadSuccessful = false;
    } else {
      double temp = sht.getTemperature();
      double hum = sht.getHumidity();

      Serial.printf("TEMP : ");
      Serial.println(temp);
      Serial.printf("HUM : ");
      Serial.println(hum);

      Serial.print("[HTTP] begin...\n");

      String contentType = "application/json";
      String postData = "{\"temperature\":" + String(temp) +
                        ",\"humidity\":" + String(hum) + "}";

      http.post("/data", contentType, postData);

      // read the status code and body of the response
      int statusCode = http.responseStatusCode();
      String response = http.responseBody();

      Serial.print("Status code: ");
      Serial.println(statusCode);
      Serial.print("Response: ");
      Serial.println(response);

      prevReadSuccessful = true;
    }
  }
  delay(1000);
}
