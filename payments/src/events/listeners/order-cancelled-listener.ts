import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@learndev24/common";
import { Message } from "node-nats-streaming";

import queueGroupName from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findById(data.id);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });

    // save order updates
    await order.save();

    // Acknowledge the message
    msg.ack();
  }
}
