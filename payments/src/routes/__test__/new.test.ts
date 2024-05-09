import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import mongoose from "mongoose";
import { stripe } from "../../stripe";

it("returns 404 when purchasing an order that doesn't exists", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "bhvdkj33sdfsijnk",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns 401 when purchasing an order that doesn't belongs to the requesting user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 99,
    status: OrderStatus.Created,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ token: "bhvdkj33sdfsijnk", orderId: order.id })
    .expect(401);
});

it("returns 400 when purchasing an order that has already been cancelled", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 99,
    status: OrderStatus.Cancelled,
    version: 0,
    userId,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({ token: "bhvdkj33sdfsijnk", orderId: order.id })
    .expect(400);
});

it("creates a charge with stripe", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 99,
    version: 0,
    userId,
  });

  await order.save();

  const confirmationToken = await stripe.testHelpers.confirmationTokens.create({
    payment_method: "pm_card_visa",
  });

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({ token: confirmationToken.id, orderId: order.id })
    .expect(201);
});
