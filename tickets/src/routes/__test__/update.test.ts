import request from "supertest";
import { format } from "node:util";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "bijkjkaa", price: 39 })
    .expect(404);
});

it("returns a 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticketProps = { title: "concert", price: 55 };

  await request(app)
    .put(format("/api/tickets/%s", id))
    .send(ticketProps)
    .expect(401);
});

it("returns a 401 if ticket does not belong to the user", async () => {
  let cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "concert", price: 55 })
    .expect(201);

  cookie = global.signin();
  await request(app)
    .put(format("/api/tickets/%s", response.body.id))
    .set("Cookie", cookie)
    .send({ title: "concert (update)", price: 550 })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "concert", price: 55 })
    .expect(201);

  await request(app)
    .put(format("/api/tickets/%s", response.body.id))
    .set("Cookie", cookie)
    .send({ title: "", price: 550 })
    .expect(400);

  await request(app)
    .put(format("/api/tickets/%s", response.body.id))
    .set("Cookie", cookie)
    .send({ title: "ecfsdcvz", price: -5 })
    .expect(400);

  await request(app)
    .put(format("/api/tickets/%s", response.body.id))
    .set("Cookie", cookie)
    .send({ title: "" })
    .expect(400);

  await request(app)
    .put(format("/api/tickets/%s", response.body.id))
    .set("Cookie", cookie)
    .send({ price: 550 })
    .expect(400);
});

it("returns updated ticket details if inputs are valid", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "concert", price: 55 })
    .expect(201);

  await request(app)
    .put(format("/api/tickets/%s", response.body.id))
    .set("Cookie", cookie)
    .send({ title: "concert (edited)", price: 45 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(format("/api/tickets/%s", response.body.id))
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual("concert (edited)");
  expect(ticketResponse.body.price).toEqual(45);
});

it("publishes an event", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asldkfj",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
