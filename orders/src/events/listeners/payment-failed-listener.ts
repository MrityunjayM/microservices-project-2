import { Listener, PaymentFailedEvent, Subjects } from "@learndev24/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Order, OrderStatus } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class PaymentFailedListener extends Listener<PaymentFailedEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subjects.PaymentFailed = Subjects.PaymentFailed;

  async onMessage(data: { orderId: string }, msg: Message): Promise<void> {
    // lookup for ticket in the db
    const order = await Order.findById(data.orderId).populate("ticket");

    // update order status to be cancelled
    order!.status = OrderStatus.Cancelled;

    // publish an OrderCancelled Event to nats
    await new OrderCancelledPublisher(this.client).publish({
      id: order!.id,
      ticket: { id: order!.ticket.id },
    });

    // Acknowledge the event
    msg.ack();
  }
}
