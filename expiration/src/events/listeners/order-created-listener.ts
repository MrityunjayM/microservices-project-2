import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@learndev24/common";

import queueGroupName from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiredAt).getTime() - new Date().getTime();
    await expirationQueue.add({ orderId: data.id }, { delay });

    msg.ack();
  }
}
