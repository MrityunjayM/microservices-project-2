import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@learndev24/common";

import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 38,
    status: OrderStatus.Created,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  // save the order
  await order.save();

  const listener = new OrderCancelledListener(natsWrapper.client);

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("updates the order status to be cancelled", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

  const updateOrder = await Order.findById(data.id);

  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
