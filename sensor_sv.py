from w1thermsensor import W1ThermSensor
import time
import requests

'''
Gets the current local time and the current temperature in celsius as measured by the temperature sensor.
Initiates a POST request to the web server, sends the time/temperature data as a json object.
Requires basic authorization to connect to the server, and verifies the server's SSL certificate.
Loops continuously and updates the time/temperature every 5 seconds.
'''

def send_sensor_data(https=True)
    sensor = W1ThermSensor()
    while True:
        t = time.localtime()
        current_time = time.strftime("%H:%M:%S", t)
        current_temperature_celsius = sensor.get_temperature()

        data = {"time": current_time, "temperature": str.format("%.2f" % current_temperature_celsius)}

        url = "https://ec2-54-152-195-135.compute-1.amazonaws.com:8800/add_sensor_record"
        if not https:
            url = "https://ec2-54-152-195-135.compute-1.amazonaws.com:8801/add_sensor_record"
        requests.post(url, json=data, verify=False)
        time.sleep(5)

if __name__ == "__main__":
    send_sensor_data()