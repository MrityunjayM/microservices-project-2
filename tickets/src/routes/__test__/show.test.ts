import request from "supertest";
import { format } from "node:util";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns 404 if ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(format("/api/tickets/%s", id)).send().expect(404);
});

it("returns the ticket if found", async () => {
  const ticketProps = { title: "concert", price: 55 };

  const response = await request(app)
    .post(format("/api/tickets"))
    .set("Cookie", global.signin())
    .send(ticketProps)
    .expect(201);

  const ticketResponse = await request(app)
    .get(format("/api/tickets/%s", response.body.id))
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(ticketProps.title);
  expect(ticketResponse.body.price).toEqual(ticketProps.price);
});
