import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketUpdatedEvent } from "@learndev24/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);

    if (!ticket) throw new Error(`Ticket not found (id - ${data.id})`);

    ticket.set({ title: data.title, price: data.price });
    await ticket.save();

    msg.ack();
  }
}
