import { Publisher, Subjects, OrderCancelledEvent } from "@learndev24/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
