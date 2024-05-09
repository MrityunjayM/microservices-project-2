import mongoose from "mongoose";
import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({
    title: "new movie",
    price: 29,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 35 });
  secondInstance!.set({ price: 45 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err: any) {
    console.error(err.message);
    return;
  }

  throw new Error("Should not reach this point");
});

it("increament's version number on multiple save's", async () => {
  const ticket = Ticket.build({
    title: "Movie Ticket",
    price: 29,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
