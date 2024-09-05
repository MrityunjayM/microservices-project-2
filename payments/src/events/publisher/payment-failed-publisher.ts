import { Publisher, Subjects, PaymentFailedEvent } from "@learndev24/common";

export class PaymentFailedPublisher extends Publisher<PaymentFailedEvent> {
  readonly subject = Subjects.PaymentFailed;
}
