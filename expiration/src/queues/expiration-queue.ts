import Queue from "bull";

import { natsWrapper } from "../nats-wrapper";
import { ExpirationCompletedPublisher } from "../events/publishers/expiration-completed-publisher";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job) => {
  await new ExpirationCompletedPublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
