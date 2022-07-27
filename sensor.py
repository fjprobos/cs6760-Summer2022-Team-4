from w1thermsensor import W1ThermSensor
import time
import requests
from requests.auth import HTTPBasicAuth

'''
Gets the current local time and the current temperature in celsius as measured by the temperature sensor.
Initiates a POST request to the web server, sends the time/temperature data as a json object.
Requires basic authorization to connect to the server, and verifies the server's SSL certificate.
Loops continuously and updates the time/temperature every 5 seconds.

'''


def send_sensor_data():
    sensor = W1ThermSensor()
    while True:
        t = time.localtime()
        current_time = time.strftime("%H:%M:%S", t)
        temperature = sensor.get_temperature()
        current_temp_celsius = str.format("%.2f" % temperature)

        data = {"time": current_time, "temperature": current_temp_celsius, "humidity": None}

        url = "https://ec2-54-152-195-135.compute-1.amazonaws.com:8800/add_sensor_record"
        requests.post(url, json=data)
        time.sleep(5)
