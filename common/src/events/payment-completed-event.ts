import { Subjects } from "./subjects";

export interface PaymentCompletedEvent {
  subject: Subjects.PaymentCompleted;
  data: {
    orderId: string;
  };
}
