import { Request, Response, Router } from "express";
import { query } from "express-validator";
import { requireAuth, validateRequest, NotAuthorizedError, NotFoundError } from "@learndev24/common";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";

import { PaymentFailedPublisher } from "../events/publisher/payment-failed-publisher";
import { PaymentCompletedPublisher } from "../events/publisher/payment-completed-publisher";
import { natsWrapper } from "../nats-wrapper";
import { Order } from "../models/order";

const router = Router();

const validations = [
  query("payment_intent_id").isString().notEmpty().withMessage("payment_intent_id is required"),
  query("status").isString().notEmpty().withMessage("status is required"),
];

router.patch("/api/payments", requireAuth, validations, validateRequest, async (req: Request, res: Response) => {
  const { payment_intent_id, status } = req.query;
  // lookup of payment record for payment_intent
  const payment = await Payment.findOne({ stripeId: payment_intent_id });

  // TODO: this validation is temproary, implement a concret & appropriate solution
  if (!payment) {
    throw new NotFoundError();
  }

  // load order if there has been a payment initiation the order
  const order = await Order.findById(payment?.orderId);

  // TODO: this validation is temproary, implement a concret & appropriate solution
  if (!order) {
    throw new NotFoundError();
  }

  if (req.currentUser!.id !== order.userId) {
    throw new NotAuthorizedError();
  }

  if (payment && status === "success") {
    // publish an event if payment is successful
    new PaymentCompletedPublisher(natsWrapper.client).publish({
      orderId: payment.orderId,
    });
  } else if (payment && status === "errored") {
    stripe.paymentIntents.cancel(payment_intent_id as string).catch(console.error);
    // publish an event if payment has failed
    new PaymentFailedPublisher(natsWrapper.client).publish({
      orderId: payment.orderId,
    });
  }

  return res.status(201).json({});
});

export { router as updateChargeRouter };
