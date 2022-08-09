import board
import adafruit_dht
import time
import requests


dhtDevice = adafruit_dht.DHT22(board.D4)
assert dhtDevice is not None
assert board.D4 is not None

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
        response = requests.post(url, json=data)
        assert response.status_code < 400
        time.sleep(5)
    except RuntimeError as error:
        print(error.args[0])
        time.sleep(2)
        continue
    except Exception as error:
        dhtDevice.exit()
        raise error
