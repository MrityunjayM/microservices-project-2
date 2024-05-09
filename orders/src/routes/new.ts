import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@learndev24/common";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // in seconds

const router = express.Router();

const validations = [
  body("ticketId")
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("TicketId is required"),
];

router.post(
  "/api/orders",
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId = req.body.ticketId;

    // Find the ticket user is trying to order from databse
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // Make sure ticket is not reserved with another order
    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError("Ticket is already reserved.");

    // Create new order and save into the database
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      ticket,
      status: OrderStatus.Created,
      expiresAt: expiration,
      userId: req.currentUser!.id,
    });

    await order.save();

    // Publish an event stating that an order has been created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiredAt: order.expiresAt.toISOString(),
      ticket: { id: ticket.id, price: ticket.price },
      version: order.version,
    });

    return res.status(201).send(order);
  }
);

export { router as createOrderRouter };
