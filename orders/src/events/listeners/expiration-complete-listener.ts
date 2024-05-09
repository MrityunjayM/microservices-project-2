import { Message } from "node-nats-streaming";
import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@learndev24/common";

import { queueGroupName } from "./queueGroupName";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    // update order status to 'order:cancelled'
    order!.set({ status: OrderStatus.Cancelled });

    // save order with updated status
    await order!.save();

    // publish an OrderCancelled Event to nats
    await new OrderCancelledPublisher(this.client).publish({
      id: order!.id,
      ticket: { id: order!.ticket.id },
    });

    // Acknowledge the event
    msg.ack();
  }
}
