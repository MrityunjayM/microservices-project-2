import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@learndev24/common";

import { createChargeRouter } from "./routes/new";
import { updateChargeRouter } from "./routes/update";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" }));

app.use(currentUser);

app.use(createChargeRouter);
app.use(updateChargeRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
