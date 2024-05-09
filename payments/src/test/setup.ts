import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: (userId?: string) => string[];
}

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
  "sk_test_51PD8pYSFAbrYC1aBEYZAYS0BEETgHwK4JebWc4ZAi2XJ9ou4g01eVToDOBEXMG2jIYpD9lOSpvRSKP2BJhp2ItWD00zI1qHtOy";

let mongo: MongoMemoryServer | any;
beforeAll(async () => {
  process.env.JWT_KEY = "3e1711a2dda926fc";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  jest.clearAllMocks();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

global.signin = (userId?: string) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: userId || new mongoose.Types.ObjectId(),
    email: "test@ticketing.dev",
  };

  // create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // create a session
  const session = JSON.stringify({ jwt: token });

  // Encode stringified token as base64 string
  const base64 = Buffer.from(session).toString("base64");

  return [`session=${base64}`];
};
