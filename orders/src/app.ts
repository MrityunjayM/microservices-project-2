import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@learndev24/common";

import { indexOrderRouter } from "./routes/index";
import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use(currentUser);

app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
