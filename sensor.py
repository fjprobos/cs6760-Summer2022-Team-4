import board
import adafruit_dht
import time
import requests

'''
Gets the current local time and the current humidity and temperature in celsius as measured by the temperature sensor.
Initiates a POST request to the web server, sends the time/temperature data as a json object.
Requires basic authorization to connect to the server, and verifies the server's SSL certificate.
Loops continuously and updates the time/temperature every 5 seconds.

'''

dhtDevice = adafruit_dht.DHT22(board.D4)

while True:
    try:
        t = time.localtime()
        temp = dhtDevice.temperature
        h = dhtDevice.humidity

        current_time = time.strftime("%H:%M:%S", t)
        temperature_c = str.format("%.2f" % temp)
        humidity = str.format("%.2f" % h)

        data = {"time": current_time, "temperature": temperature_c, "humidity": humidity}

        url = "https://ec2-54-152-195-135.compute-1.amazonaws.com:8800/add_sensor_record"
        requests.post(url, json=data, verify=False)
        time.sleep(5)
    except RuntimeError as error:
        print(error.args[0])
        time.sleep(2)
        continue
    except Exception as error:
        dhtDevice.exit()
        raise error
    


