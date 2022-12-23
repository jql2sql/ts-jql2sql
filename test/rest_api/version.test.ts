import dotenv from "dotenv";
dotenv.config();

import app from "../../src/app"
import request from "supertest";

it("/bugzilla/rest/2/version", async () => {
  const response = await request(app).get('/bugzilla/rest/2/version')
  expect(response.statusCode).toBe(200);
  expect(response.body.version).toBe(2);
});