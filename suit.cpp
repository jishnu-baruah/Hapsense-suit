#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

const char *ssid = "Galaxy 5G";    // Your WiFi SSID
const char *password = "gmwa1345"; // Your WiFi password

float distanceCm1; // Variable to store distance for sensor 1
float distanceCm2; // Variable to store distance for sensor 2

WebServer server(80); // HTTP server running on port 80

const int trigPin1 = 13;
const int echoPin1 = 12;

const int trigPin2 = 27;
const int echoPin2 = 26;

#define SOUND_SPEED 0.034
#define CM_TO_INCH 0.393701

const int NUM_MOTORS = 6;
const int motorPins[NUM_MOTORS] = {13, 8, 12, 11, 10, 9};

void setup()
{

    for (int i = 0; i < NUM_MOTORS; i++)
    {
        pinMode(motorPins[i], OUTPUT);
    }

    Serial.begin(115200); // Starts the serial communication

    pinMode(trigPin1, OUTPUT);
    pinMode(echoPin1, INPUT);

    pinMode(trigPin2, OUTPUT);
    pinMode(echoPin2, INPUT);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("Connecting to WiFi...");
        delay(1000);
    }
    Serial.println("Connected to WiFi");

    server.on("/toggle", HTTP_POST, handleToggle);
    server.on("/", handleRoot); // Set up the root handler
    server.begin();
    Serial.println("HTTP server started");
}

void loop()
{
    server.handleClient();

    // Measure distance for sensor 1
    distanceCm1 = measureDistance(trigPin1, echoPin1);

    // Measure distance for sensor 2
    distanceCm2 = measureDistance(trigPin2, echoPin2);

    // Print distances to Serial Monitor
    Serial.print("Distance Sensor 1 (cm): ");
    Serial.println(distanceCm1);
    Serial.print("Distance Sensor 2 (cm): ");
    Serial.println(distanceCm2);
    Serial.print("ESP32 IP Address: ");
    Serial.println(WiFi.localIP().toString());

    delay(10); // Adjust delay as needed
}

float measureDistance(int trigPin, int echoPin)
{
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    unsigned long duration = pulseIn(echoPin, HIGH);
    float distance = duration * SOUND_SPEED / 2.0;
    return distance;
}

void handleRoot()
{
    // Create a JSON object
    StaticJsonDocument<200> suitData;
    suitData["rDist"] = distanceCm1; // Generate a random number between 1 and 100 for rDist
    suitData["lDist"] = distanceCm2;    // Assign the distance in cm from sensor 2 to lDist

    // Serialize the JSON object to a string
    String response;
    serializeJson(suitData, response);

    // Send the JSON response
    server.send(200, "application/json", response);
}

void handleToggle()
{
    if (server.method() == HTTP_POST)
    {
        String pinStr = server.arg("pin");
        if (pinStr.length() > 0)
        {
            int pin = pinStr.toInt();
            if (pin >= 0 && pin < NUM_MOTORS)
            {
                digitalWrite(motorPins[pin], !digitalRead(motorPins[pin]));
                server.send(200, "text/plain", "Pin toggled");
                return;
            }
        }
    }
    server.send(400, "text/plain", "Invalid request");
}