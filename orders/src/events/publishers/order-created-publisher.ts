import { Publisher, Subjects, OrderCreatedEvent } from "@learndev24/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
