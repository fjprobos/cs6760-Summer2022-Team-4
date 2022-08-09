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