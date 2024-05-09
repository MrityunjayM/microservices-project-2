import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  const port = Number(process.env.PORT || 3000);

  app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
  });
};

start();

process.on("SIGINT", async (sig) => {
  console.info("Got signal: %s, terminating process...", sig);
  await mongoose.connection.destroy();
});

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);
