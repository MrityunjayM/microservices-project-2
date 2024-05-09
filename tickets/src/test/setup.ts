import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

jest.mock("../nats-wrapper");

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

global.signin = () => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
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
