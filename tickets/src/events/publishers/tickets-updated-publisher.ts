import { Publisher, Subjects, TicketUpdatedEvent } from "@learndev24/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
