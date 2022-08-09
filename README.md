# secure-raspberry-pi
IoT secure connection to the cloud + data sniffing test.

The project was designed to obtain data (current temperature, temperature, and humidity) from a raspberry pi device (client). The objective is to transfer the data to a secured server. The server generates the key-pair that will be used between the client and the server. Once a secured connection is established between the client and the server, the data transferred is then uploaded/written into the database created in the server environment.

___
###Evaluate requirement specs

The initial step was to ensure that there is data generated from the raspberry pi device. For this phase of the project, a python script (sensor.py) was created to obtain the data from the raspberry pi - if any.
~~~ python 
        current_time = time.strftime("%H:%M:%S", t)
        temperature_c = str.format("%.2f" % temp)
        humidity = str.format("%.2f" % h)

        data = {"time": current_time, "temperature": temperature_c, "humidity": humidity}
        
        url = "https://ec2-54-152-195-135.compute-1.amazonaws.com:8800/add_sensor_record"
        requests.post(url, json=data, verify=False)
        time.sleep(5)
~~~

If there is no (more) data generated from the device or an error is encountered, the script terminates and so does the transmission to the server.

~~~ python
    except RuntimeError as error:
        print(error.args[0])
        time.sleep(2)
        continue
    except Exception as error:
        dhtDevice.exit()
        raise error
~~~

As long as there is data generated from the raspberry pi, it is transmitted to the server via the secured connection. The database is updated continuously since the server is constantly "listening" for data being transmitted from the client-side.

The server used in the project was created using the AWS EC2 environment. An instance was created in EC2 to act as the server and would host the database (using Postgresql) that will be updated with the data from the raspberry pi.

![AWS EC2](images/EC2.JPG)

Within the same AWS account, a Postgresql database has been created to store the data transmitted from the client.

We are able to check that the data is being transmitted and received independent of the AWS environment by setting-up the database in PgAdmin and verifying the activity within the database.

![PgAdmin Console](images/POSTGRES.JPG)

As per the screenshot, the table (sensor_data) is continually updated from the data generated with the raspberry pi device. 
___
###Unit testing

As part of the unit testing, we can check whether there are data objects created by the raspberry pi device (client). 

~~~ python
    dhtDevice = adafruit_dht.DHT22(board.D4)
    assert dhtDevice is not None
    assert board.D4 is not None
~~~
If there is no object created, then, an Exception is generated in the python script.

For unit testing in the server, several tests were created.

The first test was to determine if the server is "listening" and therefore, able to accept any data transfer from the client (raspberry pi).
~~~ JavaScript
const request = require('supertest')
const imports = require('../app')
const app = imports.app

describe("GET / ", () => {
    test("It should respond with Pong", async () => {
      const response = await request(app).get("/ping");
      expect(response.body).toEqual("pong");
      expect(response.statusCode).toBe(200);
    });
  });
~~~

The second test is created to determine if data can be inserted into the database in the server that is not coming from the client. In the test, a specific data set is created and a corresponding message is returned depending on whether the insertion was successful. 
~~~ JavaScript
const request = require('supertest')
const imports = require('../app')
const app = imports.app

describe("POST / ", () => {
    test("It should respond with Bad Request Message", async () => {
      const response = await request(app).post("/add_sensor_record").send({
        "time": "2022-08-08 23:37:00",
        "temperature": "25.5",
        "humidity": "50"
      });
      expect(response.body).toEqual("Record at time 2022-08-08 23:37:00 inserted succesfully.");
      expect(response.statusCode).toBe(200);
    });
  });

describe("POST / ", () => {
    test("It should respond with Bad Request Message", async () => {
      const response = await request(app).post("/add_sensor_record").send({
        "time": "",
        "temperature": "25.5",
        "humidity": "50"
      });
      expect(response.body).toEqual("Bad request.");
      expect(response.statusCode).toBe(400);
    });
  });
~~~

Both tests were successful when ran using the Jest JavaScript Testing Framework.

![JavaScript test result](images/secure_raspberry_api_server_tests.png)

___
###Test for Security and Vulnerability

For the Security and Vulnerability Testing, WireShark was utilized to execute a 'packet sniffing' test. 

![WireShark Packet Sniffing](images/WIRESHARK.JPG)

In the test, the activity from the local computer was accessed and the packet coming from the server, identified by the server's IP address, was isolated. This ability to access the information exchanged from server to the local computer illustrates the vulnerability of the connection. An actor, malicious or not, is able to intercept the information being transferred into the server. 
___
###System Integration

The client and server interaction are set in the raspberry pi and AWS EC2 environments. Although we are able to check the server's activity in the EC2 environment, we wanted to utilize another software/application to test the connection and access the information located within.

Postman was used to test both the connection established with the server and the ability to post miscellaneous data that did not originate from the raspberry pi.

The test to determine if a connection is established with the server is achieved by 'pinging' the server and receiving a "pong" message if successful - otherwise, Postman will return a "Could not send request" message. In addition, an error message is generated to identify the reason for the unsuccessful request.

![POSTMAN GET REQUEST](images/POSTMAN_GET.JPG)

The test to determine if we are able to insert data into the server, which has a secured connection to the client (raspberry pi), was created as a "Post" command. The Post request mimics the data generated from the client and therefore, if the command is executed properly, the user will be unable to know that an incursion happened and that additional data was inserted into the table.

![POSTMAN POST REQUEST](images/POSTMAN_POST.JPG)

In the example provided, the request was successful and the data was inserted into the database.
___
###UI/GUI or CLI

The GUI for the project is yet to be completed. 