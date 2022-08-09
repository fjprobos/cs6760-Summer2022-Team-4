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