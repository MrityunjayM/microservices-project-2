import { Listener, OrderCreatedEvent, Subjects } from "@learndev24/common";
import { Message } from "node-nats-streaming";

import queueGroupName from "./queue-group-name";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    try {
      // save the order
      await order.save();
    } catch (err: any) {
      if (err.code === "11000") {
        msg.ack();
        return;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: order.price * 100,
        currency: "inr"
      },
      { idempotencyKey: order.id }
    );

    const payment = Payment.build({
      stripeId: paymentIntent.id,
      orderId: order.id,
    });

    await payment.save();

    // Acknowledge the message
    msg.ack();
  }
}
