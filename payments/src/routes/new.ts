import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@learndev24/common";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";

const router = Router();

const validations = [body("orderId").isString().notEmpty()];

router.post("/api/payments", requireAuth, validations, validateRequest, async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  if (req.currentUser!.id !== order.userId) {
    throw new NotAuthorizedError();
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError("Order has been cancelled, payment can't be initiated.");
  }

  const paymentIntent = await stripe.paymentIntents.create(
    { amount: order.price * 100, currency: "inr" },
    { idempotencyKey: order.id }
  );

  const payment = Payment.build({
    orderId: order.id,
    stripeId: paymentIntent.id,
  });
  await payment.save();

  return res.status(201).json({
    orderId: payment.orderId,
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  });
});

export { router as createChargeRouter };
