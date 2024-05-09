import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/users/signout", (req: Request, res: Response) => {
  // clear session
  req.session = null;

  return res.status(200).end();
});

export { router as signoutRouter };
