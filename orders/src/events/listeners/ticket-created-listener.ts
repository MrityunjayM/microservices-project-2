import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketCreatedEvent } from "@learndev24/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    try {
      const ticket = Ticket.build({
        id: data.id,
        title: data.title,
        price: data.price,
      });

      await ticket.save();

      msg.ack();
    } catch (err: any) {
      console.error(err);
    }
  }
}
