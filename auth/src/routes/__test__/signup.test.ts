import request from "supertest";
import { app } from "../../app";

it("should return a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@ticketing.dev",
      password: "password",
    })
    .expect(201);
});

it("should return a 400 on invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@ticketing",
      password: "password",
    })
    .expect(400);
});

it("should return a 400 on invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@ticketing.dev",
      password: "p",
    })
    .expect(400);
});

it("should return a 400 when email & password is missing", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@ticketing.dev" })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({ password: "password" })
    .expect(400);
});

it("prevent duplicate account creation", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@ticketing.dev", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@ticketing.dev", password: "password" })
    .expect(400);
});

it("sets a cookie on succeful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@ticketing.dev", password: "password" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
