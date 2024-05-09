import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@learndev24/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
