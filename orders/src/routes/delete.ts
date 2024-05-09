import express, { Request, Response } from "express";
// import { body } from "express-validator";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@learndev24/common";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// const validations = [
//   body("title").not().isEmpty().withMessage("Title is required"),
//   body("price")
//     .isFloat({ gt: 0 })
//     .withMessage("Price is required and must be >0"),
// ];

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate("ticket");

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Update order status to 'cancelled'
    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an event mentioning that the order has been cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: { id: order.ticket.id },
    });

    return res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
