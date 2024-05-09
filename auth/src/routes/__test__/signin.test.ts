import request from "supertest";
import { app } from "../../app";

it("should fail if email is not already registered", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@ticketing.dev",
      password: "password",
    })
    .expect(400);
});

it("should fail if invalid password in supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@ticketing.dev",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@ticketing.dev",
      password: "password@1234",
    })
    .expect(400);
});

it("should set cookie if credentials are valid", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@ticketing.dev",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@ticketing.dev",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
