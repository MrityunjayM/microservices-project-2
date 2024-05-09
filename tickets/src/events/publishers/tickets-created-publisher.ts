import { Publisher, Subjects, TicketCreatedEvent } from "@learndev24/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
