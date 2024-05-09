import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@learndev24/common";

import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/tickets-updated-publisher";

const router = express.Router();

const validations = [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price is required and must be >0"),
];

router.put(
  "/api/tickets/:id",
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket!");
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    // save changes in DB
    await ticket.save();
    // publish event to nats
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      userId: ticket.userId,
    });

    return res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
