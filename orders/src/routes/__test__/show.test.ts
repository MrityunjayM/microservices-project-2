import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("should return order details", async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: "Movie - ABC",
    price: 310,
  });

  await ticket.save();

  const user = global.signin();

  // make request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch previously create order
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(response.body[0].id).toEqual(order.id);
});

it("returns an error if user tries to see other user order", async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: "Movie - ABC",
    price: 310,
  });

  await ticket.save();

  const user = global.signin();

  // make request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch previously create order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});
