import { Publisher, Subjects, PaymentCompletedEvent } from "@learndev24/common";

export class PaymentCompletedPublisher extends Publisher<PaymentCompletedEvent> {
  readonly subject = Subjects.PaymentCompleted;
}
